import { Identifier } from "../../identifier.js";
import { Serializable, Serializer } from "../../serializer.js";

export class RegistryType<T> {
    constructor(
        public readonly identifier: Identifier,
        public readonly defaultValue: T,
        public readonly serializer: Serializable<T, Uint8Array>,
    ) { }

    static createJson<T>(identifier: Identifier, {
        name,
        defaultValue,
    }: {
        name: string;
        defaultValue: T;
    }): RegistryType<T> {
        return new RegistryType(
            identifier.join(name),
            defaultValue,
            Serializer.json(),
        );
    }

    static createSerialized<T>(identifier: Identifier, {
        name,
        defaultValue,
        serializer,
    }: {
        name: string;
        defaultValue: T;
        serializer: Serializable<T, Uint8Array>;
    }): RegistryType<T> {
        return new RegistryType(
            identifier.join(name),
            defaultValue,
            serializer,
        );
    }
}


export interface Registry<T> {
    get(): Promise<T>;
    update(fn: (value: T) => T): Promise<void>;
    listen(fn: (value: T) => void): () => void;
}
