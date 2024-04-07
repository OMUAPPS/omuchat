<script lang="ts">
	import type { LocalizedText } from '@omuchatjs/omu/localization/index.js';
	import { client } from './stores.js';

	export let text: LocalizedText | undefined;
</script>

{#if text}
	{$client.i18n.translate(text)}
{/if}
