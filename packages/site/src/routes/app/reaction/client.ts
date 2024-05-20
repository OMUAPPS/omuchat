import { Omu } from '@omujs/omu';
import { ASSET_UPLOAD_PERMISSION_ID } from '@omujs/omu/extension/asset/asset-extension.js';
import { setClient } from '@omujs/ui';
import { APP } from './app.js';

export const omu = new Omu(APP);
setClient(omu);

omu.permissions.require(ASSET_UPLOAD_PERMISSION_ID, 'com.omuapps:chatprovider/youtube/reaction');
