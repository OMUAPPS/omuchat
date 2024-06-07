<script lang="ts">
    import { FlexColWrapper, FlexRowWrapper, Localized } from '@omujs/ui';
    import AppEntry from './AppEntry.svelte';
    import { apps } from './apps.js';
    import { TAG_REGISTRY } from './category.js';
    import Page from '$lib/components/Page.svelte';

    let filteredApps = apps;
    let filterTags: string[] = [];

    function toggleTag(category: string) {
        if (filterTags.includes(category)) {
            filterTags = filterTags.filter((c) => c !== category);
        } else {
            filterTags = [...filterTags, category];
        }
    }

    $: {
        if (filterTags.length !== 0) {
            filteredApps = apps.filter((app) => {
                return filterTags.some((tag) => app.metadata?.tags?.includes(tag));
            });
        }
        if (!filterTags.includes('underdevelopment')) {
            filteredApps = filteredApps.filter(
                (app) => !app.metadata?.tags?.includes('underdevelopment'),
            );
        }
    }
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<Page>
    <header slot="header">
        <h1>
            アプリを探す
            <i class="ti ti-search" />
        </h1>
        <small> アプリを探してみる </small>
    </header>
    <main slot="content">
        <FlexRowWrapper widthFull heightFull between gap>
            <div class="search">
                <h3>
                    <i class="ti ti-tag" />
                    タグから探す
                </h3>
                <FlexColWrapper>
                    {#each Object.entries(TAG_REGISTRY) as [key, tag] (key)}
                        {@const selected = filterTags.includes(key)}
                        <button on:click={() => toggleTag(key)} class="tag" class:selected>
                            <i class={tag.icon} />
                            <Localized text={tag.name} />
                            <i class="hint ti ti-{selected ? 'check' : 'plus'}" />
                        </button>
                    {/each}
                </FlexColWrapper>
            </div>
            <FlexColWrapper widthFull gap>
                {#each filteredApps as app (app.key())}
                    <AppEntry {app} />
                {/each}
            </FlexColWrapper>
        </FlexRowWrapper>
    </main>
</Page>

<style lang="scss">
    h1 {
        font-size: 2rem;
        font-weight: 600;
        width: fit-content;
        color: var(--color-1);
    }

    h3 {
        margin-bottom: 1rem;
        color: var(--color-1);
    }

    .search {
        width: 400px;
        height: 100%;
        border-right: 1px solid var(--color-outline);
        margin-right: 40px;
        padding: 20px;
    }

    .tag {
        display: flex;
        font-weight: 600;
        font-size: 0.9rem;
    }

    button {
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
        border: none;
        background: var(--color-bg-1);
        color: var(--color-1);
        font-weight: 600;
        text-align: start;
        padding: 0 10px;
        gap: 10px;
        margin-bottom: 2px;
        outline-color: var(--color-1);

        > i {
            font-size: 20px;
        }

        > .hint {
            font-size: 16px;
            margin-left: auto;
        }

        &.selected {
            background: var(--color-1);
            color: var(--color-bg-2);
            outline-color: var(--color-bg-2);
        }

        &:hover {
            outline: 1px solid;
            outline-offset: -3px;
            transition: 0.06s;
            transition-property: margin-left;
            margin-left: 2px;
        }

        &:active {
            margin-left: 1px;
        }
    }
</style>
