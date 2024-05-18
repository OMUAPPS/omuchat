import { App, Client } from '@omuchatjs/omu';
import { setClient } from '@omuchatjs/ui';
import { BROWSER } from 'esm-env';
import { IDENTIFIER } from './app.js';
import { Chat } from '@omuchatjs/chat';

const app = new App(IDENTIFIER, {
    version: '0.1.0',
});
export const client = new Client(app);
export const chat = new Chat(client);
setClient(client);

if (BROWSER) {
    client.start();
}
