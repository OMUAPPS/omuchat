import { Serializer, type Serializable } from '../../interface/serializable.js';
import type { ExtensionType } from '../extension.js';
import type { App } from '../server/index.js';

import { EndpointInfo } from './model/index.js';

export interface EndpointType<Req = unknown, Res = unknown, ReqData = unknown, ResData = unknown> {
    info: EndpointInfo;
    type: string;
    requestSerializer: Serializable<Req, ReqData>;
    responseSerializer: Serializable<Res, ResData>;
}

export class SerializeEndpointType<Req = unknown, Res = unknown> implements EndpointType<Req, Res, any, any> {
    public info: EndpointInfo;
    public type: string;
    public requestSerializer: Serializable<Req, any>;
    public responseSerializer: Serializable<Res, any>;

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

    static of<Req, Res, ReqData, ResData>(app: App, {
        name,
        requestSerializer,
        responseSerializer,
    }: {
        name: string;
        requestSerializer?: Serializable<Req, ReqData>;
        responseSerializer?: Serializable<Res, ResData>;
    }): SerializeEndpointType<Req, Res> {
        return new SerializeEndpointType<Req, Res>({
            info: new EndpointInfo(app.key(), name),
            requestSerializer,
            responseSerializer,
        });
    }

    static ofExtension<Req, Res, ReqData, ResData>(extension: ExtensionType, {
        name,
        requestSerializer,
        responseSerializer,
    }: {
        name: string;
        requestSerializer?: Serializable<Req, ReqData>;
        responseSerializer?: Serializable<Res, ResData>;
    }): SerializeEndpointType<Req, Res> {
        return new SerializeEndpointType<Req, Res>({
            info: new EndpointInfo(extension.key, name),
            requestSerializer,
            responseSerializer,
        });
    }
}

export class JsonEndpointType<Req = unknown, Res = unknown> implements EndpointType<Req, Res, any, any> {
    public info: EndpointInfo;
    public type: string;
    public requestSerializer: Serializable<Req, any>;
    public responseSerializer: Serializable<Res, any>;

    constructor(info: EndpointInfo) {
        this.info = info;
        this.type = info.key();
        this.requestSerializer = Serializer.noop();
        this.responseSerializer = Serializer.noop();
    }

    static of<Req, Res>(app: App, {
        name,
    }: {
        name: string;
    }): JsonEndpointType<Req, Res> {
        return new JsonEndpointType<Req, Res>(new EndpointInfo(app.key(), name));
    }

    static ofExtension<Req, Res>(extension: ExtensionType, {
        name,
    }: {
        name: string;
    }): JsonEndpointType<Req, Res> {
        return new JsonEndpointType<Req, Res>(new EndpointInfo(extension.key, name));
    }
}
