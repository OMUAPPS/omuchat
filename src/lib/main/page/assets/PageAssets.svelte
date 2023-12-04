<script lang="ts">
    import { writable, type Writable } from 'svelte/store';

    import type { Asset, AssetType } from './asset';
    import AssetItem from './AssetItem.svelte';

    import InputText from '$lib/common/input/InputText.svelte';
    import InputTextLazy from '$lib/common/input/InputTextLazy.svelte';

    // test
    export const assets: Writable<Asset[]> = writable<Asset[]>(
        Array.from({ length: 100 }, (_, i) => ({
            id: `${i}`,
            name: `アセット ${i}`,
            type: ['app', 'image', 'panel'][i % 3] as AssetType,
            thumbnail: `https://picsum.photos/seed/${i}/200/200`,
            description: `asset ${i} description`,
            tags: ['tag1', 'tag2', 'tag3', `tag${i}`],
            url: `https://picsum.photos/seed/${i}/200/200`
        }))
    );

    const searchLookup = writable<Record<string, Asset>>({});

    assets.subscribe((assets) => {
        function key(asset: Asset) {
            return `${asset.name} ${asset.tags.join(' ')} ${asset.description}`;
        }
        setTimeout(() => {
            const lookup: Record<string, Asset> = {};
            assets.forEach((asset) => {
                lookup[key(asset)] = asset;
            });
            searchLookup.set(lookup);
        }, 0);
    });

    function searchAssets(search: string) {
        function score(key: string) {
            const words = search.split(' ');
            let score = 0;
            words.forEach((word) => {
                if (key.includes(word)) {
                    score++;
                }
            });
            if (key.includes(search)) {
                score += 10;
            }
            if (key.startsWith(search)) {
                score += 10;
            }
            return score;
        }

        return Object.entries($searchLookup)
            .map(([key, asset]) => ({ asset, score: score(key) }))
            .sort((a, b) => b.score - a.score)
            .filter(({ score }) => score > 0)
            .map(({ asset }) => asset);
    }

    let search = '';
</script>

<div class="container">
    <div class="header">
        <div class="title">
            <i class="ti ti-package" />
            アセット
        </div>
        <div>
            {#if $assets.length > 10000}
                <InputTextLazy placeholder="検索" bind:value={search} />
            {:else}
                <InputText placeholder="検索" bind:value={search} />
            {/if}
        </div>
    </div>
    <div class="items">
        {#if search === ''}
            {#each $assets as asset (asset.id)}
                <AssetItem {asset} />
            {/each}
        {:else}
            {#each searchAssets(search) as asset (asset.id)}
                <AssetItem {asset} />
            {/each}
        {/if}
    </div>
</div>

<style lang="scss">
    .container {
        width: 100%;
        height: calc(100vh - 80px);
        padding: 40px;
        padding-bottom: 80px;
        margin-top: 80px;
        overflow-y: scroll;
        background: var(--color-bg-1);

        .header {
            position: fixed;
            top: 40px;
            left: 40px;
            display: flex;
            flex-direction: row;
            gap: 40px;
            align-items: center;
            width: 100%;
            height: 80px;
            padding: 40px;
            color: var(--color-1);
            background: var(--color-bg-2);
            border-bottom: 1px solid var(--color-1);

            .title {
                display: flex;
                flex-direction: row;
                gap: 10px;
                align-items: baseline;
                font-size: 18px;
                font-weight: 600;
                color: var(--color-1);
            }
        }

        .items {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    }
</style>
