import { App, Client } from '@omuchatjs/chat';
import { BROWSER } from 'esm-env';
import { identifier } from './app.js';

const app = new App(identifier, {
    version: '1.0.0',
});
export const client = new Client({ app });

if (BROWSER) {
    client.run();
}
