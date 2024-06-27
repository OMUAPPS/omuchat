import { App } from '@omujs/omu';
import { Identifier } from '@omujs/omu/identifier.js';
import type { TagKey } from '../category.js';
import thumbnail from './thumbnail.png';
import { ORIGIN } from '../origin.js';
import icon from './icon.png';

export const IDENTIFIER = new Identifier('com.omuapps', 'timer');

export const APP = new App(IDENTIFIER, {
    url: `${ORIGIN}/app/timer`,
    metadata: {
        locale: 'en',
        name: {
            en: 'Timer',
            ja: 'タイマー',
        },
        description: {
            en: 'A simple timer app to measure time',
            ja: '時間を計測するためのシンプルなタイマーアプリ',
        },
        icon: icon,
        image: thumbnail,
        tags: ['asset', 'tool'] as TagKey[],
    },
});
