import { Identifier } from '../../identifier.js';
import { Serializer, type Serializable } from '../../serializer.js';

export interface PacketData {
    readonly type: string;
    readonly data: Uint8Array;
}

export interface Packet<T = unknown> {
    readonly type: PacketType<T>;
    readonly data: T;
}

export class PacketType<T> {
    constructor(
        public readonly identifier: Identifier,
        public readonly serializer: Serializable<T, Uint8Array>,
    ) { }

    static createJson<T>(identifier: Identifier, {
        name,
        serializer,
    }: {
        name: string;
        serializer?: Serializable<T, any>;
    }): PacketType<T> {
        return new PacketType(
            identifier.join(name),
            Serializer.noop<T>()
                .pipe(serializer ?? Serializer.noop())
                .pipe(Serializer.json()),
        );
    }

    static createSerialized<T>(identifier: Identifier, {
        name,
        serializer,
    }: {
        name: string;
        serializer: Serializable<T, Uint8Array>;
    }): PacketType<T> {
        return new PacketType(
            identifier.join(name),
            serializer,
        );
    }
}
