<script>
    import Button from '$lib/common/input/Button.svelte';
    import { screenContext } from '$lib/common/screen/screen';
    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
    import { t } from '$lib/i18n/i18n-context';
    import ScreenDashboardSettings from './settings/ScreenDashboardSettings.svelte';

    function openConnectScreen() {
        screenContext.push({ component: ScreenDashboardSettings, props: {} });
    }
</script>

<Button callback={openConnectScreen}>
    <Tooltip>{$t('pages.settings')}</Tooltip>
    <i class="ti ti-settings" />
</Button>
