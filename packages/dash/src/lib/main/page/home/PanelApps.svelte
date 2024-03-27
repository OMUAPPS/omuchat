<script lang="ts">
    import { DEV } from 'esm-env';
    import AppEntry from './AppEntry.svelte';

    import { getClient } from '$lib/common/omuchat/client.js';
    import { tauriWindow } from '$lib/utils/tauri.js';
    import { onMount } from 'svelte';

    import type { AppMetadata } from '$lib/common/omuchat/app-metadata.js';
    import { t } from '$lib/i18n/i18n-context.js';
    import { currentPage } from '$lib/main/settings.js';
    import { TableList } from '@omuchatjs/ui';

    export let filter: (key: string, app: AppMetadata) => boolean = () => true;
    const { dashboard } = getClient();

    onMount(() => {
        dashboard.apps.addListener({
            onAdd: () => {
                tauriWindow.appWindow.setFocus();
                $currentPage = 'main';
            },
        });
    });
</script>

<div class="container">
    <TableList table={dashboard.apps} component={AppEntry} fitHeight={true} {filter} />
    <a href={DEV ? 'http://localhost:5173' : 'https://omuchat.cc/'} target="_blank">
        {$t('panels.apps.found_apps')}
        <i class="ti ti-external-link" />
    </a>
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
        background: var(--color-bg-1);
    }

    a {
        width: fit-content;
        font-size: 14px;
        font-weight: 600;
        text-decoration: none;

        &:hover {
            border-bottom: 1px solid var(--color-1);
        }
    }
</style>
