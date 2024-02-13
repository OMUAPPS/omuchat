import { Serializer, type Serializable } from '../../interface/serializable.js';
import type { ExtensionType } from '../extension.js';
import type { App } from '../server/index.js';

import { EndpointInfo } from './endpoint-info.js';

export interface EndpointType<Req = unknown, Res = unknown> {
    info: EndpointInfo;
    type: string;
    requestSerializer: Serializable<Req, Uint8Array>;
    responseSerializer: Serializable<Res, Uint8Array>;
}

export class SerializeEndpointType<Req = unknown, Res = unknown> implements EndpointType<Req, Res> {
    public info: EndpointInfo;
    public type: string;
    public requestSerializer: Serializable<Req, Uint8Array>;
    public responseSerializer: Serializable<Res, Uint8Array>;

    private constructor({
        info,
        requestSerializer,
        responseSerializer,
    }: {
        info: EndpointInfo;
        requestSerializer?: Serializable<Req, any>;
        responseSerializer?: Serializable<Res, any>;
    }) {
        this.info = info;
        this.type = info.key();
        this.requestSerializer = requestSerializer ?? Serializer.noop();
        this.responseSerializer = responseSerializer ?? Serializer.noop();
    }

    static of<Req, Res>(app: App, {
        name,
        requestSerializer,
        responseSerializer,
    }: {
        name: string;
        requestSerializer?: Serializable<Req, Uint8Array>;
        responseSerializer?: Serializable<Res, Uint8Array>;
    }): SerializeEndpointType<Req, Res> {
        return new SerializeEndpointType<Req, Res>({
            info: new EndpointInfo(app.key(), name),
            requestSerializer,
            responseSerializer,
        });
    }

    static ofExtension<Req, Res>(extension: ExtensionType, {
        name,
        requestSerializer,
        responseSerializer,
    }: {
        name: string;
        requestSerializer?: Serializable<Req, Uint8Array>;
        responseSerializer?: Serializable<Res, Uint8Array>;
    }): SerializeEndpointType<Req, Res> {
        return new SerializeEndpointType<Req, Res>({
            info: new EndpointInfo(extension.name, name),
            requestSerializer,
            responseSerializer,
        });
    }
}

export class JsonEndpointType<Req = unknown, Res = unknown> implements EndpointType<Req, Res> {
    public info: EndpointInfo;
    public type: string;
    public requestSerializer: Serializable<Req, Uint8Array>;
    public responseSerializer: Serializable<Res, Uint8Array>;

    constructor(info: EndpointInfo, {
        requestSerializer,
        responseSerializer,
    }: {
        requestSerializer: Serializable<Req, any>;
        responseSerializer: Serializable<Res, any>;
    }) {
        this.info = info;
        this.type = info.key();
        this.requestSerializer = Serializer.noop<Req>().pipe(requestSerializer).pipe(Serializer.json());
        this.responseSerializer = Serializer.noop<Res>().pipe(responseSerializer).pipe(Serializer.json());
    }

    static of<Req, Res>(app: App, {
        name,
        requestSerializer,
        responseSerializer,
    }: {
        name: string;
        requestSerializer?: Serializable<Req, any>;
        responseSerializer?: Serializable<Res, any>;
    }): JsonEndpointType<Req, Res> {
        return new JsonEndpointType<Req, Res>(new EndpointInfo(app.key(), name), {
            requestSerializer: requestSerializer ?? Serializer.noop(),
            responseSerializer: responseSerializer ?? Serializer.noop(),
        });
    }

    static ofExtension<Req, Res>(extension: ExtensionType, {
        name,
        requestSerializer,
        responseSerializer,
    }: {
        name: string;
        requestSerializer?: Serializable<Req, any>;
        responseSerializer?: Serializable<Res, any>;
    }): JsonEndpointType<Req, Res> {
        return new JsonEndpointType<Req, Res>(new EndpointInfo(extension.name, name), {
            requestSerializer: requestSerializer ?? Serializer.noop(),
            responseSerializer: responseSerializer ?? Serializer.noop(),
        });
    }
}
