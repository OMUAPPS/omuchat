import type { Client } from '../../client/index.js';
import { ByteReader, ByteWriter } from '../../network/bytebuffer.js';
import { PacketType } from '../../network/packet/index.js';
import { Serializer } from '../../serializer.js';
import { ExtensionType } from '../extension.js';

import { type EndpointType } from './endpoint.js';

type FutureResult = {
    resolve: (data: Uint8Array) => void;
    reject: (error: Error) => void;
};

export class EndpointExtension {
    private readonly endpointMap: Map<string, EndpointType>;
    private readonly futureResultMap: Map<number, FutureResult>;
    private requestId: number;

    constructor(private readonly client: Client) {
        this.endpointMap = new Map();
        this.futureResultMap = new Map();
        this.requestId = 0;
        client.network.registerPacket(
            EndpointRegisterEvent,
            EndpointCallEvent,
            EndpointReceiveEvent,
            EndpointErrorEvent,
        );
        client.network.addPacketHandler(EndpointReceiveEvent, (event) => {
            const promise = this.futureResultMap.get(event.id);
            if (!promise) return;
            this.futureResultMap.delete(event.id);
            promise.resolve(event.data);
        });
        client.network.addPacketHandler(EndpointErrorEvent, (event) => {
            const promise = this.futureResultMap.get(event.id);
            if (!promise) return;
            this.futureResultMap.delete(event.id);
            promise.reject(new Error(event.error));
        });
    }

    register<Req, Res>(type: EndpointType<Req, Res>): void {
        if (this.endpointMap.has(type.identifier.key())) {
            throw new Error(`Endpoint for key ${type.identifier.key()} already registered`);
        }
        this.endpointMap.set(type.identifier.key(), type);
    }

    async call<Req, Res>(endpoint: EndpointType<Req, Res>, data: Req): Promise<Res> {
        const id = this.requestId++;
        const promise = new Promise<Uint8Array>((resolve, reject) => {
            this.futureResultMap.set(id, { resolve, reject });
        });
        this.client.send(EndpointCallEvent, {
            type: endpoint.identifier.key(),
            id,
            data: endpoint.requestSerializer.serialize(data),
        });
        const response = await promise;
        return endpoint.responseSerializer.deserialize(response);
    }
}

export const EndpointExtensionType = new ExtensionType(
    'endpoint',
    (client: Client) => new EndpointExtension(client),
);

export const EndpointRegisterEvent = PacketType.createJson<string>(
    EndpointExtensionType,
    {
        name: 'register',
    },
);
type EndpointReq = {
    type: string;
    id: number;
};

type EndpointReqData = {
    type: string;
    id: number;
    data: Uint8Array;
};

const serializer = new Serializer<EndpointReqData, Uint8Array>(
    (data) => {
        const writer = new ByteWriter();
        writer.writeString(data.type);
        writer.writeInt(data.id);
        writer.writeByteArray(data.data);
        return writer.finish();
    },
    (item) => {
        const reader = new ByteReader(item);
        const type = reader.readString();
        const id = reader.readInt();
        const data = reader.readByteArray();
        reader.finish();
        return { type, id, data };
    },
);

export const EndpointCallEvent = PacketType.createSerialized<EndpointReqData>(
    EndpointExtensionType,
    {
        name: 'call',
        serializer,
    },
);
export const EndpointReceiveEvent = PacketType.createSerialized<EndpointReqData>(
    EndpointExtensionType,
    {
        name: 'receive',
        serializer,
    },
);
export const EndpointErrorEvent = PacketType.createJson<EndpointReq & { error: string }>(
    EndpointExtensionType,
    {
        name: 'error',
    },
);
