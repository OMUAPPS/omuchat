import type { Client } from '../../client/index.js';
import { Identifier, IdentifierMap } from '../../identifier.js';
import { ByteReader, ByteWriter } from '../../network/bytebuffer.js';
import { PacketType } from '../../network/packet/index.js';
import { Serializer } from '../../serializer.js';
import { ExtensionType } from '../extension.js';

import { EndpointType } from './endpoint.js';

export const ENDPOINT_EXTENSION_TYPE = new ExtensionType(
    'endpoint',
    (client: Client) => new EndpointExtension(client),
);

type CallPromise = {
    resolve: (data: Uint8Array) => void;
    reject: (error: Error) => void;
};

export class EndpointExtension {
    private readonly endpointMap = new IdentifierMap<[EndpointType, (arg: any) => Promise<any>]>();
    private readonly promiseMap: Map<number, CallPromise> = new Map();
    private callId: number;

    constructor(private readonly client: Client) {
        this.callId = 0;
        client.network.registerPacket(
            ENDPOINT_REGISTER_PACKET,
            ENDPOINT_CALL_PACKET,
            ENDPOINT_RECEIVE_PACKET,
            ENDPOINT_ERROR_PACKET,
        );
        client.network.addPacketHandler(ENDPOINT_RECEIVE_PACKET, (event) => {
            const promise = this.promiseMap.get(event.id);
            if (!promise) return;
            this.promiseMap.delete(event.id);
            promise.resolve(event.data);
        });
        client.network.addPacketHandler(ENDPOINT_ERROR_PACKET, (event) => {
            const promise = this.promiseMap.get(event.id);
            if (!promise) return;
            this.promiseMap.delete(event.id);
            promise.reject(new Error(event.error));
        });
        client.network.listeners.connected.subscribe(() => this.handleConnected());
    }

    public handleConnected(): void {
        this.client.send(ENDPOINT_REGISTER_PACKET, Array.from(this.endpointMap.keys()));
    }

    public register<Req, Res>(type: EndpointType<Req, Res>, handler: (data: Req) => Promise<Res>): void {
        if (this.endpointMap.has(type.identifier)) {
            throw new Error(`Endpoint for key ${type.identifier} already registered`);
        }
        this.endpointMap.set(type.identifier, [type, handler]);
    }

    public listen<Req, Res>(handler: (data: Req) => Promise<Res>, name?: string): void {
        const type = EndpointType.createJson<Req, Res>(this.client.app.identifier, {
            name: name ?? handler.name,
        });
        this.register(type, handler);
    }

    public async call<Req, Res>(endpoint: EndpointType<Req, Res>, data: Req): Promise<Res> {
        const id = this.callId++;
        const promise = new Promise<Uint8Array>((resolve, reject) => {
            this.promiseMap.set(id, { resolve, reject });
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

const ENDPOINT_REGISTER_PACKET = PacketType.createJson<Identifier[]>(ENDPOINT_EXTENSION_TYPE, {
    name: 'register',
    serializer: Serializer.model(Identifier).toArray(),
});
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
