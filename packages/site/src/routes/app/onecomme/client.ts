import { Client } from '@omuchatjs/chat';
import { App } from '@omuchatjs/omu';
import { setClient } from '@omuchatjs/ui';
import { BROWSER } from 'esm-env';
import { IDENTIFIER } from './app.js';

const app = new App(IDENTIFIER, {
    version: '0.1.0',
});
export const client = new Client({
    app,
});
setClient(client);
client.plugins.require({
    omuplugin_onecomme: null,
});

if (BROWSER) {
    client.start();
}
