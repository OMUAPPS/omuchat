<script lang="ts">
    import { omu } from '$lib/client.js';
    import { i18n } from '$lib/i18n/i18n-context.js';
    import { DEFAULT_LOCALE, LOCALES } from '$lib/i18n/i18n.js';
    import { language } from '$lib/main/settings.js';
    import { waitForTauri } from '$lib/utils/tauri.js';
    import { createI18nUnion } from '@omujs/i18n';
    import { NetworkStatus } from '@omujs/omu/network/network.js';
    import { Theme } from '@omujs/ui';
    import './styles.scss';

    async function init() {
        await loadLocale();
        await waitForTauri();

        omu.start();
        language.subscribe(loadLocale);
        await new Promise<void>((resolve, reject) => {
            omu.whenReady(resolve);
            omu.network.event.status.listen((status) => {
                if (status === NetworkStatus.ERROR) {
                    reject(status);
                }
            });
        });
    }

    async function loadLocale() {
        const lang = await LOCALES[$language].load();
        const fallbackLang = await LOCALES[DEFAULT_LOCALE].load();
        if (lang !== fallbackLang) {
            i18n.set(createI18nUnion([lang, fallbackLang]));
        } else {
            i18n.set(lang);
        }
    }
    let promise = init();
</script>

<svelte:head>
    <title>Dashboard</title>
    <meta name="description" content="Svelte demo app" />
    <Theme />
</svelte:head>

<div class="app">
    <main>
        {#await promise}
            <div class="loading" data-tauri-drag-region>loading...</div>
        {:then}
            <slot />
        {:catch error}
            <div class="loading" data-tauri-drag-region>{error.message}</div>
        {/await}
    </main>
</div>

<style lang="scss">
    .app {
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    main {
        flex: 1;
        overflow: hidden;
    }

    .loading {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: 20px;
        font-weight: bold;
        color: var(--color-1);
        background: var(--color-bg-1);
    }
</style>
