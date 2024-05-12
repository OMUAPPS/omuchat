import { App } from '@omuchatjs/omu';
import { Identifier } from '@omuchatjs/omu/identifier.js';
import type { TagKey } from '../category.js';
import thumbnail from './thumbnail.png';

export const IDENTIFIER = new Identifier('cc.omuchat', 'reaction');

export default function getApp(origin: string) {
    return new App(IDENTIFIER, {
        url: origin + '/app/reaction',
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
}
