import { Identifier } from '@omuchatjs/omu/identifier.js';
import { AppMetadata } from '../app-metadata.js';

export const IDENTIFIER = new Identifier('cc.omuchat', 'tester');

export default (origin: string) =>
    new AppMetadata({
        identifier: IDENTIFIER.key(),
        name: 'Tester',
        url: origin + '/app/tester',
        icon: 'text-size',
    });
