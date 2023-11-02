<script>
	import { appWindow } from '@tauri-apps/api/window';
	import Button from '../Button.svelte';
	import Tooltip from '../Tooltip.svelte';

	function closeWindow() {
		appWindow.close();
	}
</script>

<Tooltip text="閉じる">
	<Button callback={closeWindow}>
		<i class="ti ti-x" />
	</Button>
</Tooltip>
