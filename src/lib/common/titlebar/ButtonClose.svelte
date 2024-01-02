<script>
    import Button from '../input/Button.svelte';
    import Tooltip from '../tooltip/Tooltip.svelte';

    import { t } from '$lib/i18n/i18n-context';
    import { tauriWindow } from '$lib/utils/tauri';

    function close() {
        tauriWindow.appWindow.close();
    }
</script>

<Button on:click={close}>
    <Tooltip>{$t('titlebar.close')}</Tooltip>
    <i class="ti ti-x" />
</Button>
