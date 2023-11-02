<script>
	import PopupRemoteConnect from '../../main/PopupRemoteConnect.svelte';
	import Button from '../Button.svelte';
	import Tooltip from '../Tooltip.svelte';
	import { getPopupContext } from '../popup/popup';

	const popup = getPopupContext();
	function openConnectPopup() {
		popup.push({
			component: PopupRemoteConnect,
			props: {}
		});
	}
</script>

<Tooltip text="リモート接続">
	<Button callback={openConnectPopup}>
		<i class="ti ti-qrcode" />
	</Button>
</Tooltip>
