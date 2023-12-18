<script>
    import Button from '../input/Button.svelte';
    import Tooltip from '../tooltip/Tooltip.svelte';

    import { t } from '$lib/i18n/i18n-context';
    import { minimizeWindow } from '$lib/utils/tauri';
</script>

<Button on:click={minimizeWindow}>
    <Tooltip>{$t('titlebar.minimize')}</Tooltip>
    <i class="ti ti-minus" />
</Button>
