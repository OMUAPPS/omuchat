import type { Json } from './json.js';

export interface Model<T extends Json> {
    toJson(): T;
    toString(): string;
}
