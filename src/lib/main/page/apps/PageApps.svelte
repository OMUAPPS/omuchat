<script lang="ts">
    import AppEntry from './AppEntry.svelte';

    import { t } from '$lib/i18n/i18n-context.js';

    import { getClient } from '$lib/common/omuchat/client.js';
    import TableList from '$lib/common/omuchat/TableList.svelte';

    const { dashboard } = getClient();
</script>

<div class="container">
    <div class="header">
        <div class="title">
            <i class="ti ti-player-play" />
            {$t('panels.apps.title')}
        </div>
        <div></div>
    </div>
    <div class="apps">
        <TableList table={dashboard.apps} component={AppEntry} />
    </div>
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        height: calc(100% - 81px);
        margin-top: 81px;
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
    }

    .apps {
        display: flex;
        flex-flow: column;
        width: fit-content;
        width: 100%;
        padding: 30px;
    }
</style>
