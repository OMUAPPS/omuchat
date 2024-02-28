import type { Client } from '../../client/index.js';
import { JsonEventType, SerializeEventType } from '../../event/index.js';
import { ByteReader, ByteWriter } from '../../helper.js';
import { Serializer } from '../../serializer.js';
import { defineExtensionType } from '../extension.js';
import type { Table } from '../table/index.js';
import { ModelTableType } from '../table/index.js';

import { EndpointInfo } from './endpoint-info.js';
import { type EndpointType } from './endpoint.js';

type CallFuture = {
    resolve: (data: any) => void;
    reject: (error: Error) => void;
}

export class EndpointExtension {
    private readonly endpointMap: Map<string, EndpointType>;
    public readonly endpoints: Table<EndpointInfo>;
    private readonly promiseMap: Map<number, CallFuture>;
    private callId: number;

    constructor(private readonly client: Client) {
        this.endpointMap = new Map();
        this.promiseMap = new Map();
        this.endpoints = this.client.tables.get(EndpointsTableType);
        this.callId = 0;
        client.events.register(EndpointRegisterEvent, EndpointCallEvent, EndpointReceiveEvent, EndpointErrorEvent);
        client.events.addListener(EndpointReceiveEvent, (event) => {
            const promise = this.promiseMap.get(event.id);
            if (!promise) return;
            this.promiseMap.delete(event.id);
            promise.resolve(event.data);
        });
        client.events.addListener(EndpointErrorEvent, (event) => {
            const promise = this.promiseMap.get(event.id);
            if (!promise) return;
            this.promiseMap.delete(event.id);
            promise.reject(new Error(event.error));
        });
    }

    register<Req, Res>(type: EndpointType<Req, Res>): void {
        if (this.endpointMap.has(type.type)) {
            throw new Error(`Endpoint for key ${type.type} already registered`);
        }
        this.endpointMap.set(type.type, type);
    }

    async call<Req, Res>(endpoint: EndpointType<Req, Res>, data: Req): Promise<Res> {
        const id = this.callId++;
        const promise = new Promise<Uint8Array>((resolve, reject) => {
            this.promiseMap.set(id, { resolve, reject });
        });
        this.client.send(EndpointCallEvent, {
            type: endpoint.type,
            id,
            data: endpoint.requestSerializer.serialize(data),
        });
        const response = await promise;
        return endpoint.responseSerializer.deserialize(response);
    }
}

export const EndpointExtensionType = defineExtensionType('endpoint', {
    create: (client: Client) => new EndpointExtension(client),
});

export const EndpointRegisterEvent = JsonEventType.ofExtension<EndpointInfo>(EndpointExtensionType, {
    name: 'register',
});
type EndpointReq = {
    type: string;
    id: number;
}

type EndpointReqData = {
    type: string;
    id: number;
    data: Uint8Array;
}

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

export const EndpointCallEvent = SerializeEventType.ofExtension<EndpointReqData>(EndpointExtensionType, {
    name: 'call',
    serializer,
});
export const EndpointReceiveEvent = SerializeEventType.ofExtension<EndpointReqData>(EndpointExtensionType, {
    name: 'receive',
    serializer,
});
export const EndpointErrorEvent = JsonEventType.ofExtension<EndpointReq & { error: string }>(EndpointExtensionType, {
    name: 'error',
});
export const EndpointsTableType = ModelTableType.ofExtension(EndpointExtensionType, {
    name: 'endpoints',
    model: EndpointInfo,
});
