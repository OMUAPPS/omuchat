<script>
    import Button from '../input/Button.svelte';
    import Tooltip from '../tooltip/Tooltip.svelte';

    import { t } from '$lib/i18n/i18n-context';
    import { closeWindow } from '$lib/util/tauri';
</script>

<Button callback={closeWindow}>
    <Tooltip>{$t('titlebar.close')}</Tooltip>
    <i class="ti ti-x" />
</Button>
