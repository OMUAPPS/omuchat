<script>
	import Button from '$lib/common/Button.svelte';
	import { popupContext } from '$lib/common/popup/popup';
	import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
	import { t } from '$lib/i18n/i18n-context';
	import PopupDashboardSettings from '$lib/main/settings/PopupDashboardSettings.svelte';

	function openConnectPopup() {
		popupContext.push({ component: PopupDashboardSettings, props: {} });
	}
</script>

<Button callback={openConnectPopup}>
	<Tooltip>{$t('pages.settings')}</Tooltip>
	<i class="ti ti-settings" />
</Button>
