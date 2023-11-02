<script lang="ts">
	import { Status, type StatusValue } from '@omuchat/client';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { getClient } from './omuchat';

	const client = getClient();
	const status = writable<StatusValue>(client.status());

	onMount(() => {
		return client.on('status', (event) => {
			status.set(event.status);
		});
	});
</script>

<p class={$status}>
	{#if $status === Status.CONNECTED}
		<i class="ti ti-check" />
	{/if}
	{#if $status === Status.CONNECTING}
		<i class="ti ti-reload" />
	{/if}
	{#if $status === Status.DISCONNECTED}
		<i class="ti ti-x" />
	{/if}
	{$status}
	{#if $status === Status.CONNECTING}
		{#if client.connectAttemptCount > 0}
			<p>接続試行回数: {client.connectAttemptCount}</p>
		{/if}
	{/if}
</p>

<style>
	p {
		color: rgba(0, 0, 0, 0.5);
		font-weight: bold;
		font-size: 12px;
		height: 100%;
	}

	.connected {
		color: var(--color-1);
	}

	.connecting {
		color: #ff8c00;
	}

	.disconnected {
		color: #ff0000;
	}
</style>
