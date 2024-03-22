<script lang="ts">
    import AssetItem from './AssetEntry.svelte';

    import { t } from '$lib/i18n/i18n-context.js';

    import InputTextLazy from '$lib/common/input/InputTextLazy.svelte';
    import type { Asset } from '$lib/common/omuchat/asset.js';
    import { getClient } from '$lib/common/omuchat/client.js';
    import { Header, TableList } from '@omuchatjs/ui';

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

<Header title={$t('pages.asset.name')} icon="ti-package">
    <div>
        <InputTextLazy placeholder={$t('general.search')} bind:value={search} />
    </div>
</Header>
<div class="container">
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
        margin-top: 0px;
        overflow-y: auto;
        background: var(--color-bg-1);
    }

    .items {
        display: flex;
        flex-direction: column;
    }
</style>
