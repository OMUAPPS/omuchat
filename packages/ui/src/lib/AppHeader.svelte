<script lang="ts">
	import type { App } from '@omuchatjs/omu';
	import Header from './Header.svelte';
	import { client } from './stores.js';

	export let app: App;

	let title = '';
	let icon = '';
	let description = '';

	const localizations = app.localizations;
	if (localizations) {
		$client.network.addTask(() => {
			if (localizations.name) {
				title = $client.i18n.translate(localizations.name);
			}
			if (localizations.icon) {
				icon = $client.i18n.translate(localizations.icon);
			}
			if (localizations.description) {
				description = $client.i18n.translate(localizations.description);
			}
		});
	}
</script>

<Header {title} icon={`ti ti-${icon}`} subtitle={description} />
