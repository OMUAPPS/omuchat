<script lang="ts">
	import type { LocalizedText } from '@omuchatjs/omu/localization/index.js';
	import { BROWSER } from 'esm-env';
	import { client } from './stores.js';

	export let text: LocalizedText | undefined;

	let displayText: string | undefined = undefined;
	if (BROWSER && text) {
		$client.network.addTask(() => {
			displayText = $client.i18n.translate(text!);
		});
	}
</script>

{#if displayText}
	{displayText}
{/if}
