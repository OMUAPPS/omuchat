<script lang="ts">
	import { getPopupContext } from '$lib/common/popup/popup';
	import PanelProvider from '$lib/panel/PanelProvider.svelte';
	import PopupSetup from './setup/PopupSetup.svelte';

	const popup = getPopupContext();
	function openConnectPopup() {
		popup.push({ component: PopupSetup, props: {} });
	}
</script>

<div class="wrapper">
	<!-- <Tooltip text="hehhhheloaolowwolrdld">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Tooltip>
	<Button callback={openConnectPopup} outline>
		<i class="ti ti-plug" />
	</Button> -->
	<PanelProvider />
</div>

<style>
	.wrapper {
		display: flex;
		height: calc(100% - 20px);
		flex-direction: row;
		align-items: center;
		margin: 10px;
	}
</style>
