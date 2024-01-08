<script lang="ts">
    import ScreenSettings from './settings/ScreenSettings.svelte';

    import Button from '$lib/common/input/Button.svelte';
    import { screenContext } from '$lib/common/screen/screen.js';
    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
    import { t } from '$lib/i18n/i18n-context.js';


    function openConnectScreen() {
        screenContext.push({ component: ScreenSettings, props: {} });
    }
</script>

<Button on:click={openConnectScreen}>
    <Tooltip>{$t('pages.settings')}</Tooltip>
    <i class="ti ti-settings" />
</Button>
