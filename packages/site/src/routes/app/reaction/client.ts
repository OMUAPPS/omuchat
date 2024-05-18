import { ASSET_UPLOAD_PERMISSION_ID } from '@omuchatjs/omu/extension/asset/asset-extension.js';
import { setClient } from '@omuchatjs/ui';
import { BROWSER } from 'esm-env';
import getApp from './app.js';
import { Client } from '@omuchatjs/omu';

const app = getApp(BROWSER ? window.location.origin : '');
export const client = new Client(app);
setClient(client);

client.permissions.require(ASSET_UPLOAD_PERMISSION_ID, 'cc.omuchat:chatprovider/youtube/reaction');
