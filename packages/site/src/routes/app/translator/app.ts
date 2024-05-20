import { App } from '@omujs/omu';
import { Identifier } from '@omujs/omu/identifier.js';
import type { TagKey } from '../category.js';
import thumbnail from './thumbnail.png';
import { ORIGIN } from '../origin.js';

export const IDENTIFIER = new Identifier('com.omuapps', 'translator');
export const APP = new App(IDENTIFIER, {
    url: `${ORIGIN}/app/translator`,
    metadata: {
        locale: 'en',
        name: {
            en: 'Translator',
            ja: '翻訳',
        },
        description: {
            en: 'Translate messages.',
            ja: 'メッセージを翻訳します。',
        },
        icon: 'language-hiragana',
        image: thumbnail,
        tags: ['tool'] as TagKey[],
    },
});
