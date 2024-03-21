import { browser } from '$app/environment';
import { App, Client } from '@omuchatjs/chat';
import { Identifier } from '@omuchatjs/omu/identifier.js';

const identifier = new Identifier('cc.omuchat', 'page');
const app = new App(identifier, {
    version: '1.0.0',
});
export const client = new Client({ app });

if (browser) {
    client.start();
}
