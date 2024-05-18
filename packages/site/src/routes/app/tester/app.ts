import { App } from '@omujs/omu';
import { Identifier } from '@omujs/omu/identifier.js';
import type { TagKey } from '../category.js';

export const IDENTIFIER = new Identifier('com.omuapps', 'tester');

export default function getApp(origin: string) {
    return new App(IDENTIFIER, {
        url: origin + '/app/tester',
        metadata: {
            locale: 'en',
            name: {
                en: 'Tester',
                ja: 'コメントテスター',
            },
            icon: 'text-size',
            tags: ['tool'] as TagKey[],
        },
    });
}
