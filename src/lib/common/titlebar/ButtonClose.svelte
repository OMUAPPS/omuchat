<script>
	import { t } from '$lib/i18n/i18n-context';
	import { appWindow } from '@tauri-apps/api/window';
	import Button from '../input/Button.svelte';
	import Tooltip from '../tooltip/Tooltip.svelte';

	function closeWindow() {
		appWindow.close();
	}
</script>

<Button callback={closeWindow}>
	<Tooltip>{$t('titlebar.close')}</Tooltip>
	<i class="ti ti-x" />
</Button>
