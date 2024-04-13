import { App } from '@omuchatjs/omu';
import { Identifier } from '@omuchatjs/omu/identifier.js';

export const IDENTIFIER = new Identifier('cc.omuchat', 'playqueue');

export default function getApp(origin: string) {
    return new App(IDENTIFIER, {
        url: origin + '/app/playqueue',
        metadata: {
            locale: 'en',
            name: 'Play Queue',
            icon: 'player-track-next',
        }
    });
}
