import type { Identifier } from '../../identifier.js';
import type { Serializable } from '../../serializer.js';
import { Serializer } from '../../serializer.js';

export class SignalType<T> {
    constructor(
        public readonly identifier: Identifier,
        public readonly serializer: Serializable<T, Uint8Array>,
    ) { }

    static createJson<T>(identifier: Identifier, {
        name,
    }: {
        name: string
    }): SignalType<T> {
        return new SignalType(
            identifier.join(name),
            Serializer.json(),
        );
    }

    static createSerialized<T>(identifier: Identifier, {
        name,
        serializer,
    }: {
        name: string,
        serializer: Serializable<T, Uint8Array>
    }): SignalType<T> {
        return new SignalType(
            identifier.join(name),
            serializer,
        );
    }
}

export interface Signal<T> {
    listen(handler: (value: T) => void): () => void;
    broadcast(body: T): void;
}
