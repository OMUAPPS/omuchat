import { textDecoder, textEncoder } from './const.js';

export interface Keyable {
    key(): string;
}

export interface Timestamped {
    createdAt: Date;
}
