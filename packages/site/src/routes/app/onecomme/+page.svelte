<script lang="ts">
    import { Omu } from '@omujs/omu';
    import { AppHeader, setClient } from '@omujs/ui';
    import { BROWSER } from 'esm-env';
    import { APP } from './app.js';
    import AppPage from '$lib/components/AppPage.svelte';

    export const omu = new Omu(APP);
    setClient(omu);

    omu.plugins.require({
        omuplugin_onecomme: '==0.4.2',
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
