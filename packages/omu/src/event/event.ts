import type { ExtensionType } from '../extension/index.js';
import type { App } from '../extension/server/index.js';
import { Serializer, type Serializable } from '../serializer.js';

export interface EventData {
    readonly type: string;
    readonly data: Uint8Array;
}

export interface EventType<T> {
    readonly type: string;
    serializer: Serializable<T, Uint8Array>;
}

export class JsonEventType<T> implements EventType<T> {
    public readonly type: string;
    public serializer: Serializable<T, Uint8Array>;

    constructor({
        owner,
        name,
        serializer,
    }: {
        owner: string;
        name: string;
        serializer?: Serializable<T, any>;
    }) {
        this.type = `${owner}:${name}`;
        this.serializer = (Serializer.noop<T>()
            .pipe(serializer ?? Serializer.noop())
            .pipe(Serializer.json()));
    }

    static of<T>(app: App, {
        name,
        serializer,
    }: {
        name: string;
        serializer?: Serializable<T, any>;
    }): JsonEventType<T> {
        return new JsonEventType<T>({ owner: app.key(), name, serializer });
    }

    static ofExtension<T>(extension: ExtensionType, {
        name,
        serializer,
    }: {
        name: string;
        serializer?: Serializable<T, any>;
    }): JsonEventType<T> {
        return new JsonEventType<T>({ owner: extension.name, name, serializer });
    }
}

export class SerializeEventType<T = any> implements EventType<T> {
    public readonly type: string;
    public serializer: Serializable<T, Uint8Array>;

    constructor({
        owner,
        name,
        serializer,
    }: {
        owner: string;
        name: string;
        serializer: Serializable<T, Uint8Array>;
    }) {
        this.type = `${owner}:${name}`;
        this.serializer = serializer;
    }

    static of<T>({
        owner,
        name,
        serializer,
    }: {
        owner: string;
        name: string;
        serializer: Serializable<T, Uint8Array>;
    }): SerializeEventType<T> {
        return new SerializeEventType<T>({ owner, name, serializer });
    }

    static ofExtension<T>(extension: ExtensionType, {
        name,
        serializer,
    }: {
        name: string;
        serializer: Serializable<T, Uint8Array>;
    }): SerializeEventType<T> {
        return new SerializeEventType<T>({ owner: extension.name, name, serializer });
    }
}
