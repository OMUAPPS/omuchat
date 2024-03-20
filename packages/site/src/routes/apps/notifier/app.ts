import { Identifier } from '@omuchatjs/omu/identifier.js';
import { AppMetadata } from '../app-metadata.js';

export const identifier = new Identifier('cc.omuchat', 'notifier');

export default (origin: string) =>
    new AppMetadata({
        identifier: identifier.key(),
        name: 'Notifier',
        url: origin + '/apps/notifier',
        icon: 'bell',
    });
