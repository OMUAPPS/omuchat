import { App } from '@omujs/omu';
import { Identifier } from '@omujs/omu/identifier.js';
import type { TagKey } from '../category.js';
import { ORIGIN } from '../origin.js';

export const IDENTIFIER = Identifier.fromKey('com.omuapps:replay');
export const APP = new App(IDENTIFIER, {
    url: `${ORIGIN}/app/replay`,
    metadata: {
        locale: 'en',
        name: {
            en: 'Replay',
            ja: 'リプレイ',
        },
        description: {
            en: 'Replay live streams.',
            ja: '配信をリプレイします。',
        },
        icon: 'clock-play',
        tags: ['tool', 'youtube', 'asset'] as TagKey[],
    },
});
