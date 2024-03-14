import { Serializable, Serializer } from "../../serializer.js";
import { Identifier } from "../../identifier.js";

export class MessageType<T> {
    constructor(
        public readonly identifier: Identifier,
        public readonly serializer: Serializable<T, Uint8Array>,
    ) { }

    static createJson<T>(identifier: Identifier, name: string): MessageType<T> {
        return new MessageType(
            identifier.join(name),
            Serializer.json(),
        );
    }

    static createSerialized<T>(identifier: Identifier, name: string, serializer: Serializable<T, Uint8Array>): MessageType<T> {
        return new MessageType(
            identifier.join(name),
            serializer,
        );
    }
}

export interface Message<T> {
    listen(handler: (value: T) => void): () => void;
    broadcast(body: T): void;
}
