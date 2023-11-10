<script>
	import { appWindow } from '@tauri-apps/api/window';
	import Button from '../Button.svelte';
	import Tooltip from '../tooltip/Tooltip.svelte';

	function minimizeWindow() {
		appWindow.minimize();
	}
</script>

<Button callback={minimizeWindow}>
	<Tooltip>最小化</Tooltip>
	<i class="ti ti-minus" />
</Button>
