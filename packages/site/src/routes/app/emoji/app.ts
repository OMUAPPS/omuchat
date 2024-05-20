import { App } from '@omujs/omu';
import { Identifier } from '@omujs/omu/identifier.js';
import type { TagKey } from '../category.js';
import { ORIGIN } from '../origin.js';

export const IDENTIFIER = new Identifier('com.omuapps', 'emoji');
export const APP = new App(IDENTIFIER, {
    url: `${ORIGIN}/app/emoji`,
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
