import type { ByteSerializer } from './serializer.js';

export type PropertyType<T> = {
    name: string;
    serializer: ByteSerializer<T>;
}

export type Property<T = unknown> = {
    type: PropertyType<T>;
    name: string;
    value: T;
    defaultValue: T;
}

export type PropertyMap = { [key: string]: Property<unknown> };
