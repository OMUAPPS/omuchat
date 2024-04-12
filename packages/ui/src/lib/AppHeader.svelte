<script lang="ts">
	import type { App } from '@omuchatjs/omu';
	import Header from './Header.svelte';
	import { client } from './stores.js';

	export let app: App;

	let title = '';
	let icon = '';

	const localizations = app.localizations;
	if (localizations) {
		$client.network.addTask(() => {
			if (localizations.name) {
				title = $client.i18n.translate(localizations.name);
			}
			if (localizations.icon) {
				icon = $client.i18n.translate(localizations.icon);
			}
		});
	}
</script>

<Header {title} icon={`ti ti-${icon}`} />
