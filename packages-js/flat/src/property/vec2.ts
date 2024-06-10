import type { Property, PropertyType } from '../property.js';

export type Vec2 = {
    x: number;
    y: number;
};

export const VEC2_TYPE: PropertyType<Vec2> = {
    name: 'vec2',
    serializer: {
        serialize(writer, value) {
            writer.writeFloat32(value.x);
            writer.writeFloat32(value.y);
        },
        deserialize(reader) {
            return {
                x: reader.readFloat32(),
                y: reader.readFloat32(),
            };
        },
    },
};

export class Vec2Property implements Property<Vec2> {
    type = VEC2_TYPE;
    name: string;
    value: Vec2;
    defaultValue: Vec2;

    constructor(name: string, value: Vec2) {
        this.name = name;
        this.value = value;
        this.defaultValue = value;
    }
}
