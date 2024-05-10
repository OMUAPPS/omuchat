<script lang="ts">
    import type { ConnectionStatus } from '@omuchatjs/omu/network/index.js';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    import { FlexColWrapper, Tooltip } from '@omuchatjs/ui';
    import { client } from './client.js';

    const status = writable<ConnectionStatus>('disconnected');

    onMount(() => {
        return client.network.event.status.listen((newStatus) => status.set(newStatus));
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
    <Tooltip>
        {#if $status === 'connected'}
            <FlexColWrapper>
                接続済み
                <span>
                    {client.network.address.host}:{client.network.address.port}
                    <small> に接続済み </small>
                </span>
            </FlexColWrapper>
        {/if}
        {#if $status === 'connecting'}
            <FlexColWrapper>
                接続中
                <span>
                    {client.network.address.host}:{client.network.address.port}
                    <small> に接続中… </small>
                </span>
            </FlexColWrapper>
        {/if}
        {#if $status === 'disconnected'}
            <FlexColWrapper>
                接続されていません
                <span>
                    {client.network.address.host}:{client.network.address.port}
                    <small> に接続できませんでした </small>
                </span>
            </FlexColWrapper>
        {/if}
    </Tooltip>
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
