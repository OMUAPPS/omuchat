import { createRegistryStore } from '$lib/helper.js';
import { Client } from '@omuchatjs/chat';
import { setClient } from '@omuchatjs/ui';
import { BROWSER } from 'esm-env';
import getApp from './app.js';
import { CONFIG_REGISTRY_TYPE } from './translator.js';

export const client = setClient(
    new Client({
        app: getApp(BROWSER ? window.location.origin : ''),
    }),
);

export const config = createRegistryStore(client, CONFIG_REGISTRY_TYPE);

if (BROWSER) {
    client.plugins.require({
        omuplugin_translator: '==0.3.2',
    });
    client.start();
}
