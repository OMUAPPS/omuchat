import { ASSET_UPLOAD_PERMISSION_ID } from '@omuchatjs/omu/extension/asset/asset-extension.js';
import { setClient } from '@omuchatjs/ui';
import { BROWSER } from 'esm-env';
import getApp from './app.js';
import { Omu } from '@omuchatjs/omu';

const app = getApp(BROWSER ? window.location.origin : '');
export const omu = new Omu(app);
setClient(omu);

omu.permissions.require(ASSET_UPLOAD_PERMISSION_ID, 'cc.omuchat:chatprovider/youtube/reaction');
