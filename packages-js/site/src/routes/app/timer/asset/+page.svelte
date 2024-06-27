<script lang="ts">
    import { page } from '$app/stores';
    import { App, Omu } from '@omujs/omu';
    import { setClient } from '@omujs/ui';
    import { BROWSER } from 'esm-env';
    import { IDENTIFIER } from '../app.js';
    import Timer from '../components/Timer.svelte';
    import { TimerApp } from '../timer-app.js';

    let assetId = BROWSER && $page.url.searchParams.get('assetId');
    const id = assetId || Date.now().toString();
    const app = new App(IDENTIFIER.join('asset', id), {
        version: '0.1.0',
    });
    const omu = new Omu(app);
    const timer = new TimerApp(omu);
    const { data } = timer;
    setClient(omu);

    if (BROWSER) {
        omu.start();
    }
</script>

{#if id}
    <Timer {timer} />
{:else}
    <p>id is not provided</p>
{/if}

<style>
    :global(body) {
        background: transparent !important;
    }
</style>
