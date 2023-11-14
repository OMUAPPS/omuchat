<script lang="ts">
    import type { ChannelInfo } from '@omuchat/client';

    export let channel: ChannelInfo;
</script>

<div class="container">
    <div class="left">
        {#if channel.icon_url}
            <img src={channel.icon_url} alt="icon" class="channel-icon" />
        {/if}
    </div>
    <div class="right">
        <div class="channel-name">{channel.name || channel.provider_id}</div>
        <small class="channel-url">
            {channel.url}
        </small>
    </div>
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: row;
        gap: 10px;
        min-height: 40px;
        padding-left: 10px;

        &:hover {
            background: var(--color-bg-1);
        }
    }

    .left {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
    }

    .channel-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
    }

    .channel-name {
        font-size: 1rem;
        opacity: 1;
    }

    .channel-url {
        opacity: 0.5;
    }
</style>
