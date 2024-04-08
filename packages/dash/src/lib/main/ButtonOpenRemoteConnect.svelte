<script lang="ts">
    import ScreenRemoteConnect from './ScreenRemoteConnect.svelte';

    import { screenContext } from '$lib/common/screen/screen.js';
    import { t } from '$lib/i18n/i18n-context.js';
    import { Button, Tooltip } from '@omuchatjs/ui';

    function openConnectScreen() {
        screenContext.push(ScreenRemoteConnect, {});
    }
</script>

<Button on:click={openConnectScreen}>
    <Tooltip>{$t('pages.remote_connect')}</Tooltip>
    <i class="ti ti-qrcode" />
</Button>
