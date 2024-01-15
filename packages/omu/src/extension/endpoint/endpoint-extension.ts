import type { Client } from '../../client/index.js';
import { JsonEventType } from '../../event/index.js';
import { defineExtensionType } from '../extension.js';
import type { Table } from '../table/index.js';
import { ModelTableType } from '../table/index.js';

import type { EndpointType } from './endpoint.js';
import { EndpointInfo } from './model/index.js';

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

    register<Req, Res, ReqData, ResData>(type: EndpointType<Req, Res, ReqData, ResData>): void {
        if (this.endpointMap.has(type.type)) {
            throw new Error(`Endpoint for key ${type.type} already registered`);
        }
        this.endpointMap.set(type.type, type);
    }

    async call<Req, Res, ReqData, ResData>(endpoint: EndpointType<Req, Res, ReqData, ResData>, data: Req): Promise<Res> {
        const json = endpoint.requestSerializer.serialize(data);
        try {
            const response = await this._call(endpoint, json);
            return endpoint.responseSerializer.deserialize(response);
        } catch (e) {
            throw new Error(`Failed to call endpoint ${endpoint.type}: ${e}`);
        }
    }

    private _call<Req, Res, ReqData, ResData>(endpoint: EndpointType<Req, Res, ReqData, ResData>, data: ReqData): Promise<ResData> {
        const id = this.callId++;
        const promise = new Promise<ResData>((resolve, reject) => {
            this.promiseMap.set(id, { resolve, reject });
        });
        this.client.send(EndpointCallEvent, { type: endpoint.type, id, data });
        return promise;
    }
}

export const EndpointExtensionType = defineExtensionType('endpoint', {
    create: (client: Client) => new EndpointExtension(client),
});

export const EndpointRegisterEvent = JsonEventType.ofExtension<EndpointInfo>(EndpointExtensionType, {
    name: 'register',
});
type EndpointEventData = {
    type: string;
    id: number;
}
export const EndpointCallEvent = JsonEventType.ofExtension<EndpointEventData & { data: any }>(EndpointExtensionType, {
    name: 'call',
});
export const EndpointReceiveEvent = JsonEventType.ofExtension<EndpointEventData & { data: any }>(EndpointExtensionType, {
    name: 'receive',
});
export const EndpointErrorEvent = JsonEventType.ofExtension<EndpointEventData & { error: string }>(EndpointExtensionType, {
    name: 'error',
});
export const EndpointsTableType = ModelTableType.ofExtension(EndpointExtensionType, {
    name: 'endpoints',
    model: EndpointInfo,
});
