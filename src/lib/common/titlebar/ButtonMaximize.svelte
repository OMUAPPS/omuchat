<script>
	import { appWindow } from '@tauri-apps/api/window';
	import Button from '../Button.svelte';
	import Tooltip from '../tooltip/Tooltip.svelte';

	function maximizeWindow() {
		appWindow.maximize();
	}
</script>

<Button callback={maximizeWindow}>
	<Tooltip>最大化</Tooltip>
	<i class="ti ti-rectangle" />
</Button>
