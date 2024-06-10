import type { PropertyMap } from './property.js';

export interface Layer<Children extends LayerMap = any, Props extends PropertyMap = any> {
    name: string;
    children: Children;
    properties: Props;
}

export type LayerMap = Readonly<{ [key: string]: Layer }>;

const a = {
    name: 'a',
    children: {
        b: {
            name: 'b',
            children: {},
            properties: {},
        },
    },
    properties: {},
} satisfies Layer;

a.children.b;
