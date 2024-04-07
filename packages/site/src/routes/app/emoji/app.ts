import { App } from '@omuchatjs/omu';
import { Identifier } from '@omuchatjs/omu/identifier.js';

export const IDENTIFIER = new Identifier('cc.omuchat', 'emoji');

export default function getApp(origin: string) {
    return new App(IDENTIFIER, {
        url: origin + '/app/emoji',
        localizations: {
            locale: 'en',
            name: {
                en: 'Emoji',
                ja: '絵文字',
            },
            icon: 'icons',
        }
    });
}
