import { createRegistryStore } from '$lib/helper.js';
import { setClient } from '@omujs/ui';
import { BROWSER } from 'esm-env';
import { CONFIG_REGISTRY_TYPE } from './translator.js';
import { Omu } from '@omujs/omu';
import { APP } from './app.js';

export const omu = new Omu(APP);
setClient(omu);

export const config = createRegistryStore(omu, CONFIG_REGISTRY_TYPE);

if (BROWSER) {
    omu.plugins.require({
        omuplugin_translator: '==0.4.2',
    });
    omu.start();
}
