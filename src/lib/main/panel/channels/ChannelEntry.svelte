<script lang="ts">
    import type { models } from '@omuchat/client';
    import { writable } from 'svelte/store';

    import ButtonMini from '$lib/common/input/ButtonMini.svelte';
    import Checkbox from '$lib/common/input/Checkbox.svelte';
    import { getClient } from '$lib/common/omuchat/client';
    import ProviderIcon from '$lib/common/omuchat/ProviderIcon.svelte';
    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';

    const { chat } = getClient();
    export let entry: models.Channel;

    let active = writable(entry.active);
    active.subscribe((value) => {
        if (value === entry.active)
            return;
        entry.active = value;
        chat.channels!.set(entry);
    });

    function remove() {
        chat.channels!.remove(entry);
    }
</script>

<div class="container">
    <div class="left">
        <div class="channel-icon">
            {#if entry.icon_url}
                <img src={entry.icon_url} alt="icon" />
            {:else}
                <ProviderIcon providerId={entry.provider_id} />
            {/if}
        </div>
        <div class="description">
            <div class="channel-name">{entry.name || entry.provider_id}</div>
            <small class="channel-url">
                {entry.url}
            </small>
        </div>
    </div>
    <div class="right">
        <ButtonMini on:click={remove}>
            <Tooltip>
                <div class="description">チャンネルを削除します。</div>
            </Tooltip>
            <i class="ti ti-trash" />
        </ButtonMini>
        <ButtonMini>
            <Tooltip>
                <div class="description">チャンネルを編集します。</div>
            </Tooltip>
            <i class="ti ti-settings" />
        </ButtonMini>
        <a href={entry.url} target="_blank">
            <ButtonMini>
                <Tooltip>
                    <div class="description">チャンネルを開きます。</div>
                </Tooltip>
                <i class="ti ti-external-link" />
            </ButtonMini>
        </a>
        <Checkbox bind:value={$active} />
    </div>
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        min-height: 60px;
        padding: 10px;
        padding-left: 10px;

        &:hover {
            background: var(--color-bg-1);
        }
    }

    .left {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
    }

    .right {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .channel-icon {
        width: 32px;
        height: 32px;
        margin: 5px;
        border-radius: 50%;
    }

    .channel-name {
        font-size: 1rem;
        opacity: 1;
    }

    .channel-url {
        opacity: 0.5;
    }

    a {
        text-decoration: none;
    }
</style>
