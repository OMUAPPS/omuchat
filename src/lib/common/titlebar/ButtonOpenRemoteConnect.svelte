<script>
	import PopupRemoteConnect from '../../main/PopupRemoteConnect.svelte';
	import Button from '../Button.svelte';
	import Tooltip from '../tooltip/Tooltip.svelte';
	import { getPopupContext } from '../popup/popup';

	const popup = getPopupContext();
	function openConnectPopup() {
		popup.push({ component: PopupRemoteConnect, props: {} });
	}
</script>

<Button callback={openConnectPopup}>
	<Tooltip>リモート接続</Tooltip>
	<i class="ti ti-qrcode" />
</Button>
