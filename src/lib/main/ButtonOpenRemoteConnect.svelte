<script>
    import PopupRemoteConnect from './PopupRemoteConnect.svelte';

    import Button from '$lib/common/input/Button.svelte';
    import { screenContext } from '$lib/common/screen/screen';
    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
    import { t } from '$lib/i18n/i18n-context';

    function openConnectPopup() {
        screenContext.push({ component: PopupRemoteConnect, props: {} });
    }
</script>

<Button callback={openConnectPopup}>
    <Tooltip>{$t('pages.remote_connect')}</Tooltip>
    <i class="ti ti-qrcode" />
</Button>
