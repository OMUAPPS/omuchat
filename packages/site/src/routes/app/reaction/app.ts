import { App } from '@omuchatjs/omu';
import { Identifier } from '@omuchatjs/omu/identifier.js';

export const IDENTIFIER = new Identifier('cc.omuchat', 'reaction');

export default function getApp(origin: string) {
    return new App(IDENTIFIER, {
        url: origin + '/app/reaction',
        localizations: {
            locale: 'en',
            name: {
                en: 'Reaction',
                ja: 'リアクション',
            },
            icon: 'sparkles',
        }
    });
}
