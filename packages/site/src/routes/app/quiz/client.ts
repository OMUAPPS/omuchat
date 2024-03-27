import { browser } from '$app/environment';
import { App, Client } from '@omuchatjs/chat';
import { identifier } from './app.js';

const app = new App(identifier, {
    version: '1.0.0',
});
export const client = new Client({ app });

if (browser) {
    client.run();
}
