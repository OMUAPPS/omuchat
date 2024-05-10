<script lang="ts">
	import { App, Client } from '@omuchatjs/chat';
	import { Identifier } from '@omuchatjs/omu/identifier.js';
	import { client } from '../stores.js';

	const load = () => {
		client.set(
			new Client({
				app: new App(new Identifier('cc.omuchat', 'test'), {
					version: '1.0.0'
				})
			})
		);
		return new Promise<void>((resolve) => {
			$client.network.event.connected.subscribe(resolve);
		});
	};
</script>

{#await load()}
	<slot />
{:then}
	<slot />
{/await}
