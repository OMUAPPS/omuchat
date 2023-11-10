<script>
	import { appWindow } from '@tauri-apps/api/window';
	import Button from '../Button.svelte';
	import Tooltip from '../tooltip/Tooltip.svelte';

	function closeWindow() {
		appWindow.close();
	}
</script>

<Button callback={closeWindow}>
	<Tooltip>閉じる</Tooltip>
	<i class="ti ti-x" />
</Button>
