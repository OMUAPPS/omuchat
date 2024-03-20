import { Identifier } from '@omuchatjs/omu/identifier.js';
import { AppMetadata } from '../app-metadata.js';

export const identifier = new Identifier('cc.omuchat', 'quiz');

export default (origin: string) =>
    new AppMetadata({
        identifier: identifier.key(),
        name: 'Quiz',
        url: origin + '/apps/quiz',
        icon: 'letter-q',
    });
