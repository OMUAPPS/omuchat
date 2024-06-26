import { makeRegistryWritable } from '$lib/helper.js';
import { setClient } from '@omujs/ui';
import { BROWSER } from 'esm-env';
import { CONFIG_REGISTRY_TYPE } from './translator.js';
import { Omu } from '@omujs/omu';
import { APP } from './app.js';
import { version } from '$lib/version.json';

export const omu = new Omu(APP);
setClient(omu);

export const config = makeRegistryWritable(omu.registry.get(CONFIG_REGISTRY_TYPE));

if (BROWSER) {
    omu.plugins.require({
        omuplugin_translator: `==${version}`,
    });
    omu.start();
}
