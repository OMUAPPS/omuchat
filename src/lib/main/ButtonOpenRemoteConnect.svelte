<script>
	import Button from '$lib/common/Button.svelte';
	import { popupContext } from '$lib/common/popup/popup';
	import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
	import { t } from '$lib/i18n/i18n-context';
	import PopupRemoteConnect from './PopupRemoteConnect.svelte';

	function openConnectPopup() {
		popupContext.push({ component: PopupRemoteConnect, props: {} });
	}
</script>

<Button callback={openConnectPopup}>
	<Tooltip>{$t('pages.remote_connect')}</Tooltip>
	<i class="ti ti-qrcode" />
</Button>
