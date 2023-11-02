<script lang="ts">
	import type { PluginInfo } from '@omuchat/client';
	import { OmuChat } from '@omuchat/client';
	import { onDestroy } from 'svelte';
	import { setClient } from './omuchat';

	export let info: PluginInfo;

	const client = new OmuChat(info);
	setClient(client);

	client.run('127.0.0.1', 26423);
	onDestroy(() => {
		client.disconnect();
	});
</script>

<slot />
