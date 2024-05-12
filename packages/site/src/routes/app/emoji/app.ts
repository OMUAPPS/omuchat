import { App } from '@omuchatjs/omu';
import { Identifier } from '@omuchatjs/omu/identifier.js';
import type { TagKey } from '../category.js';

export const IDENTIFIER = new Identifier('cc.omuchat', 'emoji');

export default function getApp(origin: string) {
    return new App(IDENTIFIER, {
        url: origin + '/app/emoji',
        metadata: {
            locale: 'en',
            name: {
                en: 'Emoji',
                ja: '絵文字',
            },
            icon: 'icons',
            tags: [] as TagKey[],
        },
    });
}
