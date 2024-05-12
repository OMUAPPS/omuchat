import { App } from '@omuchatjs/omu';
import { Identifier } from '@omuchatjs/omu/identifier.js';
import type { TagKey } from '../category.js';

export const IDENTIFIER = Identifier.fromKey('cc.omuchat:onecomme');

export default function getApp(origin: string) {
    return new App(IDENTIFIER, {
        url: origin + '/app/onecomme',
        metadata: {
            locale: 'en',
            name: {
                en: 'OneComme Integration',
                ja: 'わんコメ連携',
            },
            description: {
                en: 'Display comments in the OneComme template without any settings.',
                ja: '設定無しでコメントをわんコメのテンプレートに表示します。',
            },
            icon: 'dog',
            tags: ['tool'] as TagKey[],
        },
    });
}
