import { App } from '@omujs/omu';
import { Identifier } from '@omujs/omu/identifier.js';
import type { TagKey } from '../category.js';
import { ORIGIN } from '../origin.js';

export const IDENTIFIER = new Identifier('com.omuapps', 'notifier');
export const APP = new App(IDENTIFIER, {
    url: `${ORIGIN}/app/notifier`,
    metadata: {
        locale: 'en',
        name: 'Notifier',
        icon: 'ti-bell',
        tags: ['tool'] as TagKey[],
    },
});
