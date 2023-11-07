<script lang="ts">
	import Button from '$lib/common/Button.svelte';
	import FlexColWrapper from '$lib/common/FlexColWrapper.svelte';
	import Tooltip from '$lib/common/Tooltip.svelte';
	import { getPopupContext } from '$lib/common/popup/popup';
	import ButtonOpenRemoteConnect from '$lib/common/titlebar/ButtonOpenRemoteConnect.svelte';
	import ButtonOpenSettings from '$lib/common/titlebar/ButtonOpenSettings.svelte';
	import PanelProvider from '$lib/panel/PanelProvider.svelte';
	import PopupSetup from './setup/PopupSetup.svelte';

	const popup = getPopupContext();
	function openConnectPopup() {
		popup.push({ component: PopupSetup, props: {} });
	}
</script>

<div class="wrapper">
	<div class="tab-container">
		<Tooltip text="Setup">
			<Button callback={openConnectPopup} outline>
				<i class="ti ti-plug" />
			</Button>
		</Tooltip>
		<FlexColWrapper>
			<ButtonOpenRemoteConnect />
			<ButtonOpenSettings />
		</FlexColWrapper>
	</div>
	<PanelProvider />
</div>

<style>
	.wrapper {
		display: flex;
		height: 100%;
		flex-direction: row;
		align-items: center;
		/* margin: 10px; */
	}

	.tab-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 40px 0px;
	}
</style>
