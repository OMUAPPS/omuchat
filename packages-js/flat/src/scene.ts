import type { Layer, LayerMap } from './layer.js';
import type { Property, PropertyMap } from './property.js';

export interface Scene<
    Layers extends LayerMap = Record<string, Layer>,
    Props extends PropertyMap = Record<string, Property<unknown>>
> extends Layer {
    name: string;
    children: Layers;
    properties: Props;
}

export type SceneMap = Readonly<{ [key: string]: Scene }>;
