<script lang="ts">
	import { getClient } from '$lib/common/omuchat/omuchat';
	import MessageRenderer from '$lib/main/panel/messages/MessageEntry.svelte';
	import type { Message } from '@omuchat/client';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let filter: (message: Message) => boolean = () => true;

	const client = getClient();

	const messages = writable(client.messages.cache);

	client.messages.listen((newMessages) => {
		messages.set(newMessages);
	});

	onMount(async () => {
		messages.set(await client.messages.fetch());
	});
</script>

<div class="messages">
	{#each Object.values($messages).filter(filter || (() => true)) as message}
		<div class="message">
			<MessageRenderer {message} />
		</div>
	{/each}
</div>

<style lang="scss">
	.messages {
		display: flex;
		flex-direction: column;
	}

	.message {
		padding: 5px 0;

		&:hover {
			background: var(--color-bg-1);
		}
	}
</style>
