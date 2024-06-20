<script lang="ts">
    import AppPage from '$lib/components/AppPage.svelte';
    import { Omu } from '@omujs/omu';
    import { setClient } from '@omujs/ui';
    import { BROWSER } from 'esm-env';
    import { APP } from './app.js';
    import { FriesApp } from './fries-app.js';

    const omu = new Omu(APP);
    setClient(omu);
    const friesApp = new FriesApp(omu);
    const { testSignal, config, state } = friesApp;

    testSignal.listen((v) => {
        console.log('testSignal', v);
    });

    if (BROWSER) {
        omu.start();
    }
</script>

<AppPage>
    <main>
        <h1>aoikuru-fries</h1>
        <h3>test</h3>
        <button on:click={() => friesApp.test()}>Test</button>
        <h3>config</h3>
        <input type="text" bind:value={$config.hint} />
        <h3>text</h3>
        <textarea bind:value={$config.text} />
        3行以上は崩れる覚悟で
        <h3>state</h3>
        {JSON.stringify($state)}
    </main>
</AppPage>

<style lang="scss">
    main {
        padding: 20px;
    }

    textarea {
        width: 100%;
        height: 200px;
    }
</style>
