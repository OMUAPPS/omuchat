<script lang="ts">
	import Button from '$lib/common/Button.svelte';
	import Tooltip from '$lib/common/Tooltip.svelte';
	import { getPopupContext } from '$lib/common/popup/popup';
	import PopupSetup from './setup/PopupSetup.svelte';

	const popup = getPopupContext();
	function openConnectPopup() {
		popup.push({
			component: PopupSetup,
			props: {}
		});
	}
</script>

<div class="wrapper">
	<Tooltip text="hehhhheloaolowwolrdld">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Tooltip>
	<Button callback={openConnectPopup} outline>
		<i class="ti ti-plug" />
	</Button>
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
