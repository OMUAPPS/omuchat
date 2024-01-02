<script>
    import Button from '../input/Button.svelte';
    import Tooltip from '../tooltip/Tooltip.svelte';

    import { t } from '$lib/i18n/i18n-context';
    import { tauriWindow } from '$lib/utils/tauri';

    function minimize() {
        tauriWindow.appWindow.minimize();
    }
</script>

<Button on:click={minimize}>
    <Tooltip>{$t('titlebar.minimize')}</Tooltip>
    <i class="ti ti-minus" />
</Button>
