<script lang="ts">
    import AssetItem from './AssetEntry.svelte';

    import { t } from '$lib/i18n/i18n-context.js';

    import InputTextLazy from '$lib/common/input/InputTextLazy.svelte';
    import type { Asset } from '$lib/common/omuchat/asset.js';
    import { getClient } from '$lib/common/omuchat/client.js';
    import TableList from '$lib/common/omuchat/TableList.svelte';

    const { dashboard } = getClient();

    function getSearchString(asset: Asset) {
        return `${asset.name} ${asset.tags.join(' ')} ${asset.description}`;
    }

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

    function filter(key: string, asset: Asset) {
        if (!search) {
            return true;
        }
        return score(getSearchString(asset)) > 0;
    }

    function sort(a: Asset, b: Asset) {
        if (!search) {
            return 0;
        }
        return score(getSearchString(b)) - score(getSearchString(a));
    }

    let search = '';
</script>

<div class="container">
    <div class="header">
        <div class="title">
            <i class="ti ti-package" />
            {$t('pages.asset.name')}
        </div>
        <div>
            <InputTextLazy placeholder={$t('general.search')} bind:value={search} />
        </div>
    </div>
    <div class="items">
        {#if search === ''}
            <TableList table={dashboard.assets} component={AssetItem} {filter} {sort} />
        {/if}
    </div>
</div>

<style lang="scss">
    .container {
        width: 100%;
        height: calc(100vh - 80px);
        padding: 30px;
        padding-bottom: 80px;
        margin-top: 80px;
        overflow-y: auto;
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
        }
    }
</style>
