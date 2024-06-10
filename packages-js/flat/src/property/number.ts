import type { Property, PropertyType } from '../property.js';

export const NUMBER_TYPE: PropertyType<number> = {
    name: 'number',
    serializer: {
        serialize(writer, value) {
            writer.writeFloat32(value);
        },
        deserialize(reader) {
            return reader.readFloat32();
        },
    },
};

export class NumberProperty implements Property<number> {
    type = NUMBER_TYPE;
    name: string;
    value: number;
    defaultValue: number;

    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
        this.defaultValue = value;
    }
}
