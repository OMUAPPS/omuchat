<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    import { FlexColWrapper, Tooltip } from '@omujs/ui';
    import { omu } from '../client.js';
    import { NetworkStatus } from '@omujs/omu/network/network.js';

    const status = writable<NetworkStatus>(omu.network.status);

    onMount(() => {
        return omu.network.event.status.listen((newStatus) => status.set(newStatus));
    });
</script>

<p class={$status}>
    {#if $status === NetworkStatus.CONNECTED}
        <i class="ti ti-bolt" />
    {/if}
    {#if $status === NetworkStatus.READY}
        <i class="ti ti-check" />
    {/if}
    {#if $status === NetworkStatus.CONNECTING}
        <i class="ti ti-reload" />
    {/if}
    {#if $status === NetworkStatus.DISCONNECTED}
        <i class="ti ti-x" />
    {/if}
    <Tooltip>
        {#if $status === NetworkStatus.CONNECTED}
            <FlexColWrapper>
                接続済み
                <span>
                    {omu.network.address.host}:{omu.network.address.port}
                    <small> に接続済み </small>
                </span>
            </FlexColWrapper>
        {/if}
        {#if $status === 'connecting'}
            <FlexColWrapper>
                接続中
                <span>
                    {omu.network.address.host}:{omu.network.address.port}
                    <small> に接続中… </small>
                </span>
            </FlexColWrapper>
        {/if}
        {#if $status === 'disconnected'}
            <FlexColWrapper>
                接続されていません
                <span>
                    {omu.network.address.host}:{omu.network.address.port}
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
