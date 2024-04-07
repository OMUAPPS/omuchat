import { App, Client } from '@omuchatjs/chat';
import { BROWSER } from 'esm-env';
import { IDENTIFIER } from './app.js';

const app = new App(IDENTIFIER, {
    version: '1.0.0',
});
export const client = new Client({ app });

if (BROWSER) {
    client.start();
}
