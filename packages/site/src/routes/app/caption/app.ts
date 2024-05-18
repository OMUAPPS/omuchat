import { App } from '@omujs/omu';
import { Identifier } from '@omujs/omu/identifier.js';
import type { TagKey } from '../category.js';

export const IDENTIFIER = new Identifier('com.omuapps', 'caption');

export default function getApp(origin: string) {
    return new App(IDENTIFIER, {
        url: origin + '/app/caption',
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
            icon: 'bell',
            tags: ['tool'] as TagKey[],
        },
    });
}
