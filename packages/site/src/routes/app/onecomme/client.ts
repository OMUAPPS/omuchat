import { App, Client } from '@omuchatjs/omu';
import { setClient } from '@omuchatjs/ui';
import { IDENTIFIER } from './app.js';

const app = new App(IDENTIFIER, {
    version: '0.1.0',
});
export const client = new Client(app);
setClient(client);
client.plugins.require({
    omuplugin_onecomme: '==0.3.2',
});
