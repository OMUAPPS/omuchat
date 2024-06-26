import { App } from '@omujs/omu';
import { Identifier } from '@omujs/omu/identifier.js';
import type { TagKey } from '../category.js';
import { ORIGIN } from '../origin.js';
import icon from './icon.png';

export const IDENTIFIER = new Identifier('com.omuapps', 'caption');
export const APP = new App(IDENTIFIER, {
    url: `${ORIGIN}/app/caption`,
    metadata: {
        locale: 'en',
        name: {
            en: 'Real-time Caption',
            ja: 'リアルタイム字幕',
        },
        description: {
            en: 'Displays real-time captions.',
            ja: 'リアルタイムで字幕を表示します。',
        },
        icon: icon,
        tags: ['tool', 'asset'] as TagKey[],
    },
});
