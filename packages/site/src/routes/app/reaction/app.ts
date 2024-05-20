import { App } from '@omujs/omu';
import { Identifier } from '@omujs/omu/identifier.js';
import type { TagKey } from '../category.js';
import thumbnail from './thumbnail.png';
import { ORIGIN } from '../origin.js';

export const IDENTIFIER = new Identifier('com.omuapps', 'reaction');

export const APP = new App(IDENTIFIER, {
    url: `${ORIGIN}/app/reaction`,
    metadata: {
        locale: 'en',
        name: {
            en: 'Reaction',
            ja: 'リアクション',
        },
        description: {
            en: 'Show reactions from Youtube chat.',
            ja: 'Youtubeのチャット欄のリアクションを表示します。',
        },
        icon: 'sparkles',
        image: thumbnail,
        tags: ['youtube', 'asset'] as TagKey[],
    },
});
