<script>
    import Button from '../input/Button.svelte';
    import Tooltip from '../tooltip/Tooltip.svelte';

    import { t } from '$lib/i18n/i18n-context';
    import { tauriWindow } from '$lib/utils/tauri';

    function maximize() {
        tauriWindow.appWindow.maximize();
    }
</script>

<Button on:click={maximize}>
    <Tooltip>{$t('titlebar.maximize')}</Tooltip>
    <i class="ti ti-rectangle" />
</Button>
