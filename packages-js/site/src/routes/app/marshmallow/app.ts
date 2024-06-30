import { App } from '@omujs/omu';
import { Identifier } from '@omujs/omu/identifier.js';
import type { TagKey } from '../category.js';
import { ORIGIN } from '../origin.js';

export const APP_ID = Identifier.fromKey('com.omuapps:marshmallow');
export const APP = new App(APP_ID, {
    url: `${ORIGIN}/app/marshmallow`,
    metadata: {
        locale: 'en',
        name: {
            en: 'Marshmallow Integration',
            ja: 'マシュマロ連携',
        },
        description: {
            en: 'An app to read marshmallow without any hassle.',
            ja: '面倒なことなしにマシュマロを読むためのアプリ',
        },
        icon: 'ti-notes',
        tags: ['tool'] as TagKey[],
    },
});
