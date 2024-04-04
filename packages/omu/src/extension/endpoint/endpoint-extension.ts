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
    private callId: number;

    constructor(private readonly client: Client) {
        this.endpointMap = new Map();
        this.futureResultMap = new Map();
        this.callId = 0;
        client.network.registerPacket(
            ENDPOINT_REGISTER_PACKET,
            ENDPOINT_CALL_PACKET,
            ENDPOINT_RECEIVE_PACKET,
            ENDPOINT_ERROR_PACKET,
        );
        client.network.addPacketHandler(ENDPOINT_RECEIVE_PACKET, (event) => {
            const promise = this.futureResultMap.get(event.id);
            if (!promise) return;
            this.futureResultMap.delete(event.id);
            promise.resolve(event.data);
        });
        client.network.addPacketHandler(ENDPOINT_ERROR_PACKET, (event) => {
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
        const id = this.callId++;
        const promise = new Promise<Uint8Array>((resolve, reject) => {
            this.futureResultMap.set(id, { resolve, reject });
        });
        this.client.send(ENDPOINT_CALL_PACKET, {
            type: endpoint.identifier.key(),
            id,
            data: endpoint.requestSerializer.serialize(data),
        });
        const response = await promise;
        return endpoint.responseSerializer.deserialize(response);
    }
}

export const ENDPOINT_EXTENSION_TYPE = new ExtensionType(
    'endpoint',
    (client: Client) => new EndpointExtension(client),
);
type EndpointPacket = {
    type: string;
    id: number;
};

type EndpointDataPacket = EndpointPacket & {
    data: Uint8Array;
};

type EndpointErrorPacket = EndpointPacket & {
    error: string;
};

const ENDPOINT_REGISTER_PACKET = PacketType.createJson<string>(ENDPOINT_EXTENSION_TYPE, {
    name: 'register',
});
const ENDPOINT_DATA_SERIALIZER = new Serializer<EndpointDataPacket, Uint8Array>(
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

const ENDPOINT_CALL_PACKET = PacketType.createSerialized<EndpointDataPacket>(ENDPOINT_EXTENSION_TYPE, {
    name: 'call',
    serializer: ENDPOINT_DATA_SERIALIZER,
});
const ENDPOINT_RECEIVE_PACKET = PacketType.createSerialized<EndpointDataPacket>(ENDPOINT_EXTENSION_TYPE, {
    name: 'receive',
    serializer: ENDPOINT_DATA_SERIALIZER,
});
const ENDPOINT_ERROR_PACKET = PacketType.createJson<EndpointErrorPacket>(ENDPOINT_EXTENSION_TYPE, {
    name: 'error',
});
