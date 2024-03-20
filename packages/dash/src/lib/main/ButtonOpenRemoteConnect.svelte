<script lang="ts">
    import ScreenRemoteConnect from './ScreenRemoteConnect.svelte';

    import Button from '$lib/common/input/Button.svelte';
    import { screenContext } from '$lib/common/screen/screen.js';
    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
    import { t } from '$lib/i18n/i18n-context.js';

    function openConnectScreen() {
        screenContext.push(ScreenRemoteConnect, {});
    }
</script>

<Button on:click={openConnectScreen}>
    <Tooltip>{$t('pages.remote_connect')}</Tooltip>
    <i class="ti ti-qrcode" />
</Button>
