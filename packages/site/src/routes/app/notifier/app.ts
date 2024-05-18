import { App } from '@omujs/omu';
import { Identifier } from '@omujs/omu/identifier.js';
import type { TagKey } from '../category.js';

export const IDENTIFIER = new Identifier('com.omuapps', 'notifier');

export default function getApp(origin: string) {
    return new App(IDENTIFIER, {
        url: origin + '/app/notifier',
        metadata: {
            locale: 'en',
            name: 'Notifier',
            icon: 'bell',
            tags: ['tool'] as TagKey[],
        },
    });
}
