<script lang="ts">
	import type { App } from '@omuchatjs/omu';
	import Header from './Header.svelte';
	import { client } from './stores.js';

	export let app: App;

	let title = '';
	let icon = '';
	let description = '';

	function updateMetadata() {
		const metadata = app.metadata;
		if (metadata) {
			if (metadata.name) {
				title = $client.i18n.translate(metadata.name);
			}
			if (metadata.icon) {
				icon = $client.i18n.translate(metadata.icon);
			}
			if (metadata.description) {
				description = $client.i18n.translate(metadata.description);
			}
		}
	}

	if ($client.ready) {
		updateMetadata();
	} else {
		$client.event.ready.subscribe(() => {
			updateMetadata();
		});
	}
</script>

<Header {title} icon={`ti ti-${icon}`} subtitle={description}>
	<slot />
</Header>
