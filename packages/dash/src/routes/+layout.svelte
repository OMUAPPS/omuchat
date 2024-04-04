<script lang="ts">
    import { client } from '$lib/common/omuchat/client.js';
    import { screenContext } from '$lib/common/screen/screen.js';
    import { i18n } from '$lib/i18n/i18n-context.js';
    import { DEFAULT_LOCALE, LOCALES, createI18nUnion } from '$lib/i18n/i18n.js';
    import { language } from '$lib/main/settings.js';
    import ScreenInstalling from '$lib/main/setup/ScreenInstalling.svelte';
    import { IS_TAURI, invoke, listen, waitForTauri } from '$lib/utils/tauri.js';
    import { Theme } from '@omuchatjs/ui';
    import './styles.scss';

    async function init() {
        await loadLocale();
        await waitForTauri();

        if (IS_TAURI) {
            const state = await invoke('get_server_state');
            if (state == 'Installed' || state == 'AlreadyRunning') {
                client.start();
                return;
            }
            screenContext.push(ScreenInstalling, {});
            listen('server-state', (state) => {
                console.log(state);
                if (state.payload === 'Installed') {
                    client.start();
                }
            });
        } else {
            client.start();
        }

        await client.network.waitForConnection();
        await client.plugins.waitForPlugins();

        language.subscribe(loadLocale);
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
</script>

<svelte:head>
    <title>Dashboard</title>
    <meta name="description" content="Svelte demo app" />
    <Theme />
</svelte:head>

<div class="app">
    <main>
        {#await init()}
            <div class="loading" data-tauri-drag-region></div>
        {:then}
            <slot />
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

    .error {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: 20px;
        color: var(--color-bg-1);
        background: var(--color-1);

        .container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            .title {
                display: flex;
                flex-direction: column;
                gap: 0;
                align-items: flex-start;
                padding: 0 10px;
                font-size: 24px;
                line-height: 24px;
                color: var(--color-1);
                background: var(--color-bg-2);

                small {
                    b {
                        margin: 0 5px;
                        margin-left: 30px;
                    }

                    font-size: 14px;
                }
            }

            .message {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                font-size: 16px;
                color: var(--color-bg-2);
                text-align: start;
                appearance: none;
                background: transparent;
                background: var(--color-1);
                border: none;
                outline: none;

                &:hover {
                    color: var(--color-1);
                    background: var(--color-bg-2);
                }
            }

            .buttons {
                display: flex;
                flex-direction: row;
                gap: 10px;
                align-items: center;
                justify-content: center;
                margin-top: 10px;

                button {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    justify-content: center;
                    height: 40px;
                    padding: 0 10px;
                    margin-top: 40px;
                    font-size: 16px;
                    color: var(--color-bg-1);
                    cursor: pointer;
                    background: var(--color-1);
                    border: 1px solid var(--color-bg-1);

                    &:hover {
                        color: var(--color-1);
                        background: var(--color-bg-1);
                    }
                }
            }
        }
    }
</style>
