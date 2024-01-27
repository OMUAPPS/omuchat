<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    import Component from '../common/component/PropedComponent.svelte';
    import Tooltip from '../common/tooltip/Tooltip.svelte';

    import ButtonOpenRemoteConnect from './ButtonOpenRemoteConnect.svelte';
    import ButtonOpenSettings from './ButtonOpenSettings.svelte';
    import PageApps from './page/apps/PageApps.svelte';
    import PageAssets from './page/assets/PageAssets.svelte';
    import PageDev from './page/dev/PageDev.svelte';
    import PageHome from './page/home/PageHome.svelte';
    import { pages } from './page/page.js';
    import PageChannels from './page/PageChannels.svelte';
    import PageMessages from './page/PageMessages.svelte';
    import { currentPage, devMode } from './settings.js';
    import ScreenInstalling from './setup/ScreenInstalling.svelte';
    
    import FlexColWrapper from '$lib/common/FlexColWrapper.svelte';
    import { getClient } from '$lib/common/omuchat/client.js';
    import { screenContext } from '$lib/common/screen/screen.js';
    import { t } from '$lib/i18n/i18n-context.js';
    import { style } from '$lib/utils/class-helper.js';
    import { invoke, isOnTauri, listen, waitForLoad } from '$lib/utils/tauri.js';

    const { client } = getClient();

    pages.set(new Map());
    $pages.set('main', {
        name: 'main',
        component: () => {
            return {
                component: PageHome,
                props: {}
            };
        }
    });
    $pages.set('message', {
        name: 'message',
        component: () => {
            return {
                component: PageMessages,
                props: {}
            };
        }
    });
    $pages.set('channel', {
        name: 'channel',
        component: () => {
            return {
                component: PageChannels,
                props: {}
            };
        }
    });
    $pages.set('asset', {
        name: 'asset',
        component: () => {
            return {
                component: PageAssets,
                props: {}
            };
        }
    });
    $pages.set('app', {
        name: 'app',
        component: () => {
            return {
                component: PageApps,
                props: {}
            };
        }
    });

    $: if ($devMode) {
        $pages.set('dev', {
            name: 'dev',
            component: () => {
                return {
                    component: PageDev,
                    props: {}
                };
            }
        });
    } else {
        $pages.delete('dev');
    }

    let cachedPages = writable(new Set<string>([$currentPage]));

    $: {
        cachedPages.update((set) => {
            set.add($currentPage);
            return set;
        });
    }

    onMount(async () => {
        await waitForLoad();

        if (isOnTauri) {
            const state = await invoke('get_server_state');
            if (state == 'Installed' || state == 'AlreadyRunning') {
                client.start();
                return;
            }
            screenContext.push({
                component: ScreenInstalling,
                props: {}
            });
            listen('server-state', (state) => {
                console.log(state);
                if (state.payload === 'Installed') {
                    client.start();
                }
            });
        } else {
            client.start();
        }
    });
</script>

<div class="wrapper">
    <div class="tab-container">
        <FlexColWrapper>
            {#each $pages.entries() as [key, page] (key)}
                <button
                    class="page"
                    on:click={() => {
                        $currentPage = page.name;
                    }}
                    class:active={$currentPage === page.name}
                >
                    <Tooltip>{$t(`pages.${page.name}.name`)}</Tooltip>
                    <i class={$t(`pages.${page.name}.icon`)} />
                </button>
            {/each}
        </FlexColWrapper>
        <FlexColWrapper>
            <ButtonOpenRemoteConnect />
            <ButtonOpenSettings />
        </FlexColWrapper>
    </div>
    {#each $pages.entries() as [key, page] (key)}
        <div
            style={style({ display: $currentPage === page.name ? '' : 'none' })}
            class="page-container"
        >
            {#if $cachedPages.has(page.name)}
                <Component component={page.component()} />
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
    .wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 100%;
    }

    .tab-container {
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        justify-content: space-between;
        width: 40px;
        height: 100%;
        padding-top: 45px;
        padding-bottom: 40px;
        background: var(--color-bg-2);
        outline: 1px solid var(--color-outline);
    }

    .page {
        width: 40px;
        height: 40px;
        font-size: 16px;

        // color: var(--color-1);
        color: color-mix(in srgb, var(--color-1) 75%, var(--color-bg-2) 0%);
        background: none;
        background: var(--color);
        border: none;
        outline: none;

        &:hover {
            color: var(--color-1);
            background: var(--color-bg-2);
            outline: 1px solid var(--color-1);
            outline-offset: -3px;
        }

        &.active {
            z-index: 2;
            color: var(--color-bg-1);
            background: var(--color-1);

            &::after {
                position: absolute;
                top: 50%;
                right: 0;
                content: '';
                border: 8px solid transparent;
                border-left-color: var(--color-bg-2);
                transform: translate(100%, -50%);
            }
        }
    }

    .page-container {
        width: calc(100% - 40px);
        height: 100%;
    }
</style>
