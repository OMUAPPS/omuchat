<script lang="ts">
  import { writable } from 'svelte/store';

    import Component from '../common/component/PropedComponent.svelte';
    import Tooltip from '../common/tooltip/Tooltip.svelte';

    import ButtonOpenRemoteConnect from './ButtonOpenRemoteConnect.svelte';
    import ButtonOpenSettings from './ButtonOpenSettings.svelte';
    import PageAssets from './page/assets/PageAssets.svelte';
    import { pages } from './page/page';
    import PageChannels from './page/PageChannels.svelte';
    import PageDev from './page/PageDev.svelte';
    import PageHome from './page/PageHome.svelte';
    import PageMessages from './page/PageMessages.svelte';
    import { currentPage, devMode, layoutInvert } from './settings';

    import FlexColWrapper from '$lib/common/FlexColWrapper.svelte';
    import { t } from '$lib/i18n/i18n-context';
    import { style } from '$lib/util/class-helper';
    
    pages.set({
        main: {
            name: 'main',
            component: () => {
                return {
                    component: PageHome,
                    props: {}
                };
            }
        },
        message: {
            name: 'message',
            component: () => {
                return {
                    component: PageMessages,
                    props: {}
                };
            }
        },
        channel: {
            name: 'channel',
            component: () => {
                return {
                    component: PageChannels,
                    props: {}
                };
            }
        },
        asset: {
            name: 'asset',
            component: () => {
                return {
                    component: PageAssets,
                    props: {}
                };
            }
        },
        app: {
            name: 'app',
            component: () => {
                return {
                    component: PageAssets,
                    props: {}
                };
            }
        }
    });

    $: if ($devMode) {
        $pages.dev = {
            name: 'dev',
            component: () => {
                return {
                    component: PageDev,
                    props: {}
                };
            }
        };
    } else {
        delete $pages.dev;
    }

    let cachedPages = writable<string[]>([$currentPage]);
</script>

<div class="wrapper" class:invert={$layoutInvert}>
    <div class="tab-container">
        <FlexColWrapper>
            {#each Object.values($pages) as page}
                <button
                    class="page"
                    on:click={() => {
                        if (!$cachedPages.includes(page.name)) {
                            $cachedPages = [...$cachedPages, page.name];
                        }
                        currentPage.set(page.name);
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
    {#each Object.entries($pages) as [key, page] (key)}
        <div
            style={style({ display: $currentPage === page.name ? '' : 'none' })}
            class="page-container"
        >
            {#if $cachedPages.includes(page.name)}
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

    .invert {
        flex-direction: row-reverse;
    }

    .tab-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        justify-content: space-between;
        width: 40px;
        height: 100%;
        padding-top: 50px;
        padding-bottom: 40px;
    }

    .page {
        width: 40px;
        height: 40px;
        font-size: 16px;
        background: none;
        border: none;
        outline: none;

        &:hover {
            color: color-mix(in srgb, var(--color-bg-1) 10%, var(--color-1));
            background-color: color-mix(in srgb, var(--color-1) 10%, transparent);
        }

        &.active {
            color: var(--color-bg-1);
            background: var(--color-1);
        }
    }

    .page-container {
        width: calc(100% - 40px);
        height: 100%;
    }
</style>
