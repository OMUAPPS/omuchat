<script lang="ts">
    import { Omu } from '@omujs/omu';
    import { AppHeader, setClient } from '@omujs/ui';
    import { BROWSER } from 'esm-env';
    import { APP } from './app.js';
    import { version } from '$lib/version.json';
    import AppPage from '$lib/components/AppPage.svelte';

    export const omu = new Omu(APP);
    setClient(omu);

    omu.plugins.require({
        omuplugin_onecomme: `==${version}`,
    });

    if (BROWSER) {
        omu.start();
    }
</script>

<AppPage>
    <header slot="header">
        <AppHeader app={APP} />
    </header>
</AppPage>
