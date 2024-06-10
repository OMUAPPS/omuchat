import { ByteReader, ByteWriter } from './bytebuffer.js';
import type { Layer } from './layer.js';
import type { Property } from './property.js';
import type { Scene, SceneMap } from './scene.js';

type FlatOptions<Scenes extends SceneMap = Record<string, Scene>> = {
    scenes: Scenes;
};

export class Flat<Scenes extends SceneMap = Record<string, Scene>> {
    public readonly scenes: Scenes;

    constructor(options: FlatOptions<Scenes>) {
        this.scenes = options.scenes;
    }

    public serialize(): Uint8Array {
        const writer = new ByteWriter();
        const writeProperty = (writer: ByteWriter, property: Property<unknown>): void => {
            writer.writeString(property.name);
            property.type.serializer.serialize(writer, property.value);
        };
        const writeLayer = (writer: ByteWriter, layer: Layer): void => {
            writer.writeString(layer.name);
            writer.writeMap(layer.properties, writeProperty);
            writer.writeMap(layer.children, writeLayer);
        };
        const writeScene = (writer: ByteWriter, scene: Scene): void => {
            writer.writeString(scene.name);
            writer.writeMap(scene.properties, writeProperty);
            writer.writeMap(scene.children, writeLayer);
        };
        writer.writeMap(this.scenes, writeScene);
        return writer.finish();
    }

    public deserialize(data: Uint8Array): void {
        const reader = new ByteReader(data);
        const readProperty = (property: Property<unknown>): void => {
            property.value = property.type.serializer.deserialize(reader);
        };
        const readLayer = (layer: Layer): void => {
            reader.readMap((reader) => {
                const name = reader.readString();
                const property = layer.properties[name];
                readProperty(property);
            });
            reader.readMap((reader) => {
                const name = reader.readString();
                const child = layer.children[name];
                readLayer(child);
            });
        };
        const readScene = (scene: Scene): void => {
            reader.readMap((reader) => {
                const name = reader.readString();
                const property = scene.properties[name];
                readProperty(property);
            });
            reader.readMap((reader) => {
                const name = reader.readString();
                const child = scene.children[name];
                readLayer(child);
            });
        };
        reader.readMap((reader) => {
            const name = reader.readString();
            const scene = this.scenes[name];
            readScene(scene);
        });
    }
}
