import type { ExtensionType } from '../extension/index.js';
import type { App } from '../extension/server/index.js';
import { Serializer, type Serializable } from '../interface/index.js';

export interface EventJson<T = any> {
    readonly type: string;
    readonly data: T;
}

export interface EventType<T = any, D = any> {
    readonly type: string;
    serializer: Serializable<T, D>;
}

export class JsonEventType<T> implements EventType<T, T> {
    public readonly type: string;
    public serializer: Serializable<T, T>;

    constructor({
        owner,
        name,
    }: {
        owner: string;
        name: string;
    }) {
        this.type = `${owner}:${name}`;
        this.serializer = Serializer.noop();
    }

    static of<T>(app: App, {
        name,
    }: {
        name: string;
    }): JsonEventType<T> {
        return new JsonEventType<T>({ owner: app.key(), name });
    }

    static ofExtension<T>(extension: ExtensionType, {
        name,
    }: {
        name: string;
    }): JsonEventType<T> {
        return new JsonEventType<T>({ owner: extension.key, name });
    }
}

export class SerializeEventType<T = any, D = any> implements EventType<T, D> {
    public readonly type: string;
    public serializer: Serializable<T, D>;

    constructor({
        owner,
        name,
        serializer,
    }: {
        owner: string;
        name: string;
        serializer: Serializable<T, D>;
    }) {
        this.type = `${owner}:${name}`;
        this.serializer = serializer;
    }

    static of<T, D>({
        owner,
        name,
        serializer,
    }: {
        owner: string;
        name: string;
        serializer: Serializable<T, D>;
    }): SerializeEventType<T, D> {
        return new SerializeEventType<T, D>({ owner, name, serializer });
    }

    static ofExtension<T, D>({
        extension,
        name,
        serializer,
    }: {
        extension: ExtensionType;
        name: string;
        serializer: Serializable<T, D>;
    }): SerializeEventType<T, D> {
        return new SerializeEventType<T, D>({ owner: extension.key, name, serializer });
    }
}
