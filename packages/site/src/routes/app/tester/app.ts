import { App } from '@omujs/omu';
import { Identifier } from '@omujs/omu/identifier.js';
import type { TagKey } from '../category.js';
import { ORIGIN } from '../origin.js';

export const IDENTIFIER = new Identifier('com.omuapps', 'tester');
export const APP = new App(IDENTIFIER, {
    url: `${ORIGIN}/app/tester`,
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
