<script lang="ts">
    import type { models } from '@omuchat/client';
    import { onMount } from 'svelte';

    import MessageContent from './MessageContent.svelte';
    import Role from './Role.svelte';

    import { getClient } from '$lib/common/omuchat/client';
    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
    import { applyOpacity, style } from '$lib/utils/class-helper';
    export let entry: models.Message;

    const { chat } = getClient();

    let author: models.Author | undefined;
    async function getAuthor() {
        if (!entry.author_id) return null;
        author = await chat.authors.get(entry.author_id);
    }
    onMount(() => {
        getAuthor();
    });
</script>

<div class="message" style={style(entry.paid ? {
    borderLeft: `2px solid var(--color-1)`,
    background: `${applyOpacity('var(--color-1)', 0.1)}`,
} : {})}>
    <div class="left">
        {#if author && author.avatar_url}
            <img src={author.avatar_url} alt="avatar" class="author-avatar" width="32" height="32" />
            <Tooltip noBackground>
                <img src={author.avatar_url} alt="avatar" class="author-avatar-preview" />
            </Tooltip>
        {/if}
    </div>
    <div class="right">
        {#if author}
            <div class="author-name">
                <span class="name">
                    {author.name}
                    {#if author.roles}
                        <div class="roles">
                            {#each author.roles as role}
                                <Role role={role} />
                            {/each}
                        </div>
                    {/if}
                    <small>
                        {author.id}
                    </small>
                </span>
                {#if entry.created_at}
                    <span class="time">
                        {entry.created_at.toLocaleTimeString()}
                    </span>
                {/if}
            </div>
        {/if}
        {#if entry.content}
            <div class="message-content">
                <MessageContent component={entry.content} />
            </div>
        {/if}
        {#if entry.paid}
            <div class="paid">
                {entry.paid.currency}{entry.paid.amount}
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    .message {
        display: flex;
        flex-direction: row;
        gap: 10px;
        padding: 10px;
        font-weight: 500;
        border-bottom: 1px solid var(--color-bg-1);
        outline-offset: -5px;

        &:hover {
            background: var(--color-bg-1);
        }
    }

    .left {
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: center;
        min-width: 32px;
        height: fit-content;
        min-height: 32px;
        margin-top: 4px;
    }

    .right {
        width: 100%;
    }

    .author-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
    }

    .author-avatar-preview {
        width: 128px;
        height: 128px;
        outline: 2px solid #000;
    }

    .roles {
        display: flex;
        flex-flow: row nowrap;
        gap: 5px;
        align-items: baseline;
        width: fit-content;
        overflow: hidden;
        white-space: nowrap;
    }

    .author-name {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        padding: 2px 0;
        font-size: 0.8rem;
        color: #666;
        user-select: text;

        .name {
            display: flex;
            flex-direction: row;
            gap: 5px;
            align-items: baseline;
            white-space: nowrap;

            small {
                font-size: 0.6rem;
                color: #999;
            }
        }
    }

    .message-content {
        position: relative;
        margin-right: 14px;
        margin-bottom: 5px;
        overflow: clip;
        font-size: 0.9rem;
        word-break: auto-phrase;
        overflow-wrap: break-word;
        user-select: text;
        contain: content;
    }

    .paid {
        width: 100%;
        padding: 2px;
        font-size: 0.8rem;
        font-weight: bold;
        color: var(--color-1);
        user-select: text;
    }
</style>
