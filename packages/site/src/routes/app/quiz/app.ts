import { App } from '@omuchatjs/omu';
import { Identifier } from '@omuchatjs/omu/identifier.js';
import type { TagKey } from '../category.js';

export const IDENTIFIER = new Identifier('cc.omuchat', 'quiz');

export default function getApp(origin: string) {
    return new App(IDENTIFIER, {
        url: origin + '/app/quiz',
        metadata: {
            locale: 'en',
            name: 'Quiz',
            icon: 'letter-q',
            tags: ['game'] as TagKey[],
        },
    });
}
