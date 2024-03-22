<script lang="ts">
    import AppEntry from './AppEntry.svelte';

    import { t } from '$lib/i18n/i18n-context.js';

    import { getClient } from '$lib/common/omuchat/client.js';
    import { Header, TableList } from '@omuchatjs/ui';

    const { dashboard } = getClient();
</script>

<Header title={$t('panels.apps.title')} icon="ti-player-play" />
<div class="container">
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
        overflow-y: scroll;
        background: var(--color-bg-1);
    }

    .apps {
        display: flex;
        flex-flow: column;
        width: fit-content;
        width: 100%;
        padding: 30px;
    }
</style>
