import type { PropertyType } from '../property.js';

import type { Vec2 } from './vec2.js';

export type Path2 = ReadonlyArray<Vec2>;

export const PATH2_TYPE: PropertyType<Path2> = {
    name: 'path2',
    serializer: {
        serialize(writer, value) {
            writer.writeArray(value, (writer, value) => {
                writer.writeFloat32(value.x);
                writer.writeFloat32(value.y);
            });
        },
        deserialize(reader) {
            return reader.readArray(reader => {
                return {
                    x: reader.readFloat32(),
                    y: reader.readFloat32(),
                };
            });
        },
    },
};

export class Path2Property {
    type = PATH2_TYPE;
    name: string;
    value: Path2;
    defaultValue: Path2;

    constructor(name: string, value: Path2) {
        this.name = name;
        this.value = value;
        this.defaultValue = value;
    }
}
