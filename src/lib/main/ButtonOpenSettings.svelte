<script>
    import ScreenDashboardSettings from './settings/ScreenDashboardSettings.svelte';

    import Button from '$lib/common/input/Button.svelte';
    import { screenContext } from '$lib/common/screen/screen';
    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
    import { t } from '$lib/i18n/i18n-context';

    function openConnectScreen() {
        screenContext.push({ component: ScreenDashboardSettings, props: {} });
    }
</script>

<Button on:click={openConnectScreen}>
    <Tooltip>{$t('pages.settings')}</Tooltip>
    <i class="ti ti-settings" />
</Button>
