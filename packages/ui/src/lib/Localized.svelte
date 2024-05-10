<script lang="ts">
	import type { Locale, LocalizedText } from '@omuchatjs/omu/localization/index.js';
	import { BROWSER } from 'esm-env';
	import { client } from './stores.js';

	export let text: LocalizedText | undefined;

	let displayText: string | undefined = undefined;
	if (BROWSER && text) {
		if ($client.network.connected) {
			displayText = $client.i18n.translate(text);
		} else {
			const locales = window.navigator.languages as Locale[];
			displayText = $client.i18n.selectBestTranslation(locales, text);
			$client.whenReady(() => {
				displayText = $client.i18n.translate(text!);
			});
		}
	}
</script>

{#if displayText}
	{displayText}
{/if}
