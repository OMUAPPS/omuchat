import { App } from '@omujs/omu';
import { Identifier } from '@omujs/omu/identifier.js';
import type { TagKey } from '../category.js';

export const IDENTIFIER = new Identifier('com.omuapps', 'emoji');

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
