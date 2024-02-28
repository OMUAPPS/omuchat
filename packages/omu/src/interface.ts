import { textDecoder, textEncoder } from './const.js';

export interface Keyable {
    key(): string;
}

export interface Model<T extends any> {
    toJson(): T;
    toString(): string;
}

export interface Timestamped {
    createdAt: Date;
}
