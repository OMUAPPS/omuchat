import { Client } from '@omuchatjs/chat';
import { App } from '@omuchatjs/omu';
import { ASSET_UPLOAD_MANY_PERMISSION_ID } from '@omuchatjs/omu/extension/asset/asset-extension.js';
import { setClient } from '@omuchatjs/ui';
import { IDENTIFIER } from './app.js';

const app = new App(IDENTIFIER, {
    version: '0.1.0',
});
export const client = setClient(
    new Client({
        app,
    }),
);

client.plugins.require({
    omuplugin_emoji: '==0.3.2',
});
client.permissions.require(ASSET_UPLOAD_MANY_PERMISSION_ID);
