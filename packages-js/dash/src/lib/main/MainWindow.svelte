<script lang="ts">
    import { writable } from 'svelte/store';

    import ButtonOpenSettings from './ButtonOpenSettings.svelte';
    import PageDev from './page/dev/PageDev.svelte';
    import PageHome from './page/home/PageHome.svelte';
    import { pages } from './page/page.js';
    import PageChannels from './page/PageChannels.svelte';
    import PageMessages from './page/PageMessages.svelte';
    import { currentPage, devMode } from './settings.js';

    import { t } from '$lib/i18n/i18n-context.js';
    import { style } from '$lib/utils/class-helper.js';
    import { FlexColWrapper, FlexRowWrapper, Tooltip } from '@omujs/ui';

    pages.set(new Map());
    $pages.set('main', {
        name: 'main',
        component: PageHome,
        props: {},
    });
    $pages.set('message', {
        name: 'message',
        component: PageMessages,
        props: {},
    });
    $pages.set('channel', {
        name: 'channel',
        component: PageChannels,
        props: {},
    });

    $: if ($devMode) {
        $pages.set('dev', {
            name: 'dev',
            component: PageDev,
            props: {},
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

    function handleKeydown(event: KeyboardEvent) {
        // ctrl + [1234567890] to switch pages
        const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        if (event.ctrlKey && numbers.includes(event.key)) {
            const index = numbers.indexOf(event.key);
            if (index >= $pages.size) return;
            $currentPage = [...$pages.keys()][index];
            event.preventDefault();
            return;
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<FlexRowWrapper heightFull>
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
            <ButtonOpenSettings />
        </FlexColWrapper>
    </div>
    {#each $pages.entries() as [key, page] (key)}
        <div
            style={style({ display: $currentPage === page.name ? '' : 'none' })}
            class="page-container"
        >
            {#if $cachedPages.has(page.name)}
                <svelte:component this={page.component} {...page.props} />
            {/if}
        </div>
    {/each}
</FlexRowWrapper>

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
            color: var(--color-1);
            background: color-mix(in srgb, var(--color-1) 12%, transparent 0%);
            border-left: 4px solid var(--color-1);
            outline: 2px solid var(--color-bg-2);
            outline-offset: -2px;
        }
    }

    .page-container {
        width: calc(100% - 40px);
        height: 100%;
    }
</style>
