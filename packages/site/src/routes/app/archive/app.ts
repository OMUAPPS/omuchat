import { App } from '@omujs/omu';
import { Identifier } from '@omujs/omu/identifier.js';
import type { TagKey } from '../category.js';
import { ORIGIN } from '../origin.js';

export const IDENTIFIER = Identifier.fromKey('com.omuapps:archive');
export const APP = new App(IDENTIFIER, {
    url: `${ORIGIN}/app/archive`,
    metadata: {
        locale: 'en',
        name: {
            en: 'Archive',
            ja: 'アーカイブ',
        },
        description: {
            en: 'Automatically archive live streams.',
            ja: '配信を自動的にアーカイブします。',
        },
        icon: 'archive',
        tags: ['tool'] as TagKey[],
    },
});
