<script lang="ts">
    import { page } from '$app/stores';
    import { FlexColWrapper, FlexRowWrapper, Localized } from '@omuchatjs/ui';
    import AppEntry from './AppEntry.svelte';
    import { apps, loadApps } from './apps.js';
    import { TAG_REGISTRY } from './category.js';

    loadApps($page.url.origin);

    let filteredApps = apps;
    let selectedCategories: string[] = [];

    function toggleCategory(category: string) {
        if (selectedCategories.includes(category)) {
            selectedCategories = selectedCategories.filter((c) => c !== category);
        } else {
            selectedCategories = [...selectedCategories, category];
        }
    }

    $: {
        filteredApps = apps.filter((app) => {
            if (selectedCategories.length === 0) return true;
            return selectedCategories.every((category) => app.metadata?.tags?.includes(category));
        });
    }
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<h2>
    <b>
        アプリを探す
        <i class="ti ti-search" />
    </b>
</h2>
<section>
    <FlexRowWrapper widthFull heightFull between gap>
        <div class="search">
            <h3>
                <i class="ti ti-tag" />
                タグから探す
            </h3>
            <FlexColWrapper>
                {#each Object.entries(TAG_REGISTRY) as [key, category] (key)}
                    {@const selected = selectedCategories.includes(key)}
                    <button on:click={() => toggleCategory(key)} class="category" class:selected>
                        <i class={category.icon} />
                        <Localized text={category.name} />
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
</section>

<style lang="scss">
    h2 {
        margin: 1rem;
        padding: 1rem 0rem;
        font-size: 1.5rem;
        font-weight: 500;
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

    button {
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
        border: none;
        background: var(--color-bg-2);
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
            margin-left: 3px;
        }

        &:active {
            margin-left: -1px;
        }
    }

    section {
        display: flex;
        flex: 0.6;
        flex-direction: column;
        align-items: start;
        justify-content: center;
    }
</style>
