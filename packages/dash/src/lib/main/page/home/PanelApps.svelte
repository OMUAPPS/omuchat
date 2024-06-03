<script lang="ts">
    import AppEntry from './AppEntry.svelte';

    import { dashboard } from '$lib/client.js';
    import type { App } from '@omujs/omu';
    import { TableList } from '@omujs/ui';

    export let filter: (key: string, app: App) => boolean = () => true;
</script>

<div class="container">
    <TableList table={dashboard.apps} component={AppEntry} {filter} />
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--color-bg-1);
    }
</style>
