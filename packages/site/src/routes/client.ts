import { App, Omu } from '@omuchatjs/omu';
import {
    DASHBOARD_OPEN_APP_PERMISSION_ID,
    DASHOBARD_APP_EDIT_PERMISSION_ID,
    DASHOBARD_APP_READ_PERMISSION_ID,
} from '@omuchatjs/omu/extension/dashboard/dashboard-extension.js';
import { Identifier } from '@omuchatjs/omu/identifier.js';
import { setClient } from '@omuchatjs/ui';
import { BROWSER } from 'esm-env';

const identifier = new Identifier('cc.omuchat', 'page');
const app = new App(identifier, {
    version: '1.0.0',
});
export const omu = new Omu(app);
setClient(omu);
omu.permissions.require(
    DASHOBARD_APP_READ_PERMISSION_ID,
    DASHOBARD_APP_EDIT_PERMISSION_ID,
    DASHBOARD_OPEN_APP_PERMISSION_ID,
);

if (BROWSER) {
    omu.start();
}
