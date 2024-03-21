import { browser } from '$app/environment';
import { Client } from '@omuchatjs/chat';
import { App } from '@omuchatjs/omu';
import { IDENTIFIER } from './app.js';

const app = new App(IDENTIFIER, {
    version: '0.1.0',
});
export const client = new Client({
    app,
});

if (browser) {
    client.start();
}