<script>
	import { appWindow } from '@tauri-apps/api/window';
	import Button from '../Button.svelte';
	import Tooltip from '../Tooltip.svelte';

	function minimizeWindow() {
		appWindow.minimize();
	}
</script>

<Tooltip text="最小化">
	<Button callback={minimizeWindow}>
		<i class="ti ti-minus" />
	</Button>
</Tooltip>
