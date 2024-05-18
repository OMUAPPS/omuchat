import { App, Omu } from '@omujs/omu';
import { setClient } from '@omujs/ui';
import { IDENTIFIER } from './app.js';

const app = new App(IDENTIFIER, {
    version: '0.1.0',
});
export const omu = new Omu(app);
setClient(omu);
omu.plugins.require({
    omuplugin_onecomme: '==0.4.2',
});
