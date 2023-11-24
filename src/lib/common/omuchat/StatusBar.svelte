<script lang="ts">
    import type { ConnectionStatus } from '@omuchat/client/src/connection';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    import { getClient } from './client';


    const { client } = getClient();
    const status = writable<ConnectionStatus>(client.connection.status());

    onMount(() => {
        return client.connection.addListener({
            onStatusChanged: (newStatus) => {
                status.set(newStatus);
            }
        })
    });
</script>

<p class={$status}>
    {#if $status === 'connected'}
        <i class="ti ti-check" />
    {/if}
    {#if $status === 'connecting'}
        <i class="ti ti-reload" />
    {/if}
    {#if $status === 'disconnected'}
    <i class="ti ti-x" />
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
