import type { ByteReader, ByteWriter } from './bytebuffer.js';

export interface ByteSerializer<T> {
    serialize(writer: ByteWriter, value: T): void;
    deserialize(reader: ByteReader): T;
}
