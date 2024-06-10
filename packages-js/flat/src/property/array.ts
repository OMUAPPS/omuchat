import type { ByteReader, ByteWriter } from '../bytebuffer.js';
import type { Property, PropertyType } from '../property.js';

export class ArrayProperty<P extends Property<unknown>> implements Property<P[]> {
    type: PropertyType<P[]>;
    name: string;
    value: P[];
    defaultValue: P[];

    constructor(name: string, value: P[], type: PropertyType<P>) {
        const serialize = (writer: ByteWriter, value: P[]): void => {
            writer.writeArray(value, (writer, value) => {
                type.serializer.serialize(writer, value);
            });
        };
        const deserialize = (reader: ByteReader): P[] => {
            return reader.readArray((reader) => {
                return type.serializer.deserialize(reader);
            });
        };
        this.type = {
            name: 'array',
            serializer: { serialize, deserialize },
        };
        this.name = name;
        this.value = value;
        this.defaultValue = value;
    }
}
