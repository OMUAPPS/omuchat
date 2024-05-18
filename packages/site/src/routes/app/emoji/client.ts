import { App, Omu } from '@omuchatjs/omu';
import { ASSET_UPLOAD_MANY_PERMISSION_ID } from '@omuchatjs/omu/extension/asset/asset-extension.js';
import { setClient } from '@omuchatjs/ui';
import { IDENTIFIER } from './app.js';
import { Chat } from '@omuchatjs/chat';

const app = new App(IDENTIFIER, {
    version: '0.1.0',
});
export const omu = new Omu(app);
export const chat = new Chat(omu);
setClient(omu);

omu.plugins.require({
    omuplugin_emoji: '==0.3.2',
});
omu.permissions.require(ASSET_UPLOAD_MANY_PERMISSION_ID);
