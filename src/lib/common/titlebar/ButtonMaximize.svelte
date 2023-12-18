<script>
    import Button from '../input/Button.svelte';
    import Tooltip from '../tooltip/Tooltip.svelte';

    import { t } from '$lib/i18n/i18n-context';
    import { maximizeWindow } from '$lib/utils/tauri';

</script>

<Button on:click={maximizeWindow}>
    <Tooltip>{$t('titlebar.maximize')}</Tooltip>
    <i class="ti ti-rectangle" />
</Button>
