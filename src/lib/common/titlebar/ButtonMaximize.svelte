<script>
    import { appWindow } from '@tauri-apps/api/window';

    import Button from '../input/Button.svelte';
    import Tooltip from '../tooltip/Tooltip.svelte';

    import { t } from '$lib/i18n/i18n-context';

    function maximizeWindow() {
        appWindow.maximize();
    }
</script>

<Button callback={maximizeWindow}>
    <Tooltip>{$t('titlebar.maximize')}</Tooltip>
    <i class="ti ti-rectangle" />
</Button>
