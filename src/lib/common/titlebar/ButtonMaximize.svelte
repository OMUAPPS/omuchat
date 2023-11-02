<script>
	import { appWindow } from '@tauri-apps/api/window';
	import Button from '../Button.svelte';
	import Tooltip from '../Tooltip.svelte';

	function maximizeWindow() {
		appWindow.maximize();
	}
</script>

<Tooltip text="最大化">
	<Button callback={maximizeWindow}>
		<i class="ti ti-rectangle" />
	</Button>
</Tooltip>
