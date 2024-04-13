import { Client } from '@omuchatjs/chat';
import { setClient } from '@omuchatjs/ui';
import { BROWSER } from 'esm-env';
import getApp from './app.js';

export const client = setClient(new Client({
    app: getApp(BROWSER ? window.location.origin : ''),
}));

if (BROWSER) {
    client.plugins.require({
        omuplugin_translator: null,
    })
    client.start();
}
