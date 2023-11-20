<script lang="ts">
    import type { Message } from '@omuchat/client';

    import MessageComponentRenderer from './MessageContent.svelte';

    export let message: Message;
</script>

<div class="message">
    <div class="left">
        {#if message.author && message.author.avatar_url}
            <img src={message.author.avatar_url} alt="avatar" class="author-avatar" />
        {/if}
    </div>
    <div class="right">
        {#if message.author}
            <div class="author-name">{message.author.name}</div>
        {/if}
        {#if message.content}
            <div class="message-content">
                <MessageComponentRenderer component={message.content} />
            </div>
        {/if}
    </div>
</div>

<style>
    .message {
        display: flex;
        flex-direction: row;
        gap: 10px;
        margin-left: 10px;
    }

    .left {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
    }

    .author-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
    }

    .author-name {
        font-size: 0.8rem;
        opacity: 0.5;
    }

    .message-content {
        font-size: 1rem;

        & > img {
            max-height: 30px;
            object-fit: contain;
        }

        & > * {
            margin-top: 5px;
        }
    }
</style>
