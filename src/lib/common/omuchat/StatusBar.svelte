<script lang="ts">
	import { t } from '$lib/i18n/i18n-context';
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
	{#if $status === Status.CONNECTING || $status === Status.RECONNECTING}
		<i class="ti ti-reload" />
	{/if}
	{#if $status === Status.DISCONNECTED}
		<i class="ti ti-x" />
	{/if}
	{$t(`status.${$status}`)}
	{#if $status === Status.RECONNECTING}
		<p>{$t('status.connect_attempt_count', { count: client.connectAttemptCount })}</p>
	{/if}
</p>

<style>
	p {
		height: 100%;
		font-size: 12px;
		font-weight: bold;
		color: rgb(0 0 0 / 50%);
	}

	.connected {
		color: var(--color-1);
	}

	.connecting {
		color: var(--color-1);
	}

	.reconnecting {
		color: #ff8c00;
	}

	.disconnected {
		color: #f00;
	}
</style>
