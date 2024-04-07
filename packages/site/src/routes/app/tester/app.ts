import { App } from '@omuchatjs/omu';
import { Identifier } from '@omuchatjs/omu/identifier.js';

export const IDENTIFIER = new Identifier('cc.omuchat', 'tester');

export default function getApp(origin: string) {
    return new App(IDENTIFIER, {
        url: origin + '/app/tester',
        localizations: {
            locale: 'en',
            name: 'Tester',
            icon: 'text-size',
        }
    });
}
