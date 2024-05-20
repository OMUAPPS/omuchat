import { App } from '@omujs/omu';
import { Identifier } from '@omujs/omu/identifier.js';
import type { TagKey } from '../category.js';
import { ORIGIN } from '../origin.js';

export const IDENTIFIER = new Identifier('com.omuapps', 'playqueue');
export const APP = new App(IDENTIFIER, {
    url: `${ORIGIN}/app/playqueue`,
    metadata: {
        locale: 'en',
        name: 'Play Queue',
        icon: 'player-track-next',
        tags: ['tool'] as TagKey[],
    },
});
