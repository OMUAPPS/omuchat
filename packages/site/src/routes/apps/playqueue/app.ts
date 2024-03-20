import { Identifier } from '@omuchatjs/omu/identifier.js';
import { AppMetadata } from '../app-metadata.js';

export const identifier = new Identifier('cc.omuchat', 'playqueue');

export default (origin: string) =>
    new AppMetadata({
        identifier: identifier.key(),
        name: 'Play Queue',
        url: origin + '/apps/playqueue',
        icon: 'player-track-next',
    });
