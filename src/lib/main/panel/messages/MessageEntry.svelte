<script lang="ts">
    import type { models } from '@omuchat/client';

    import MessageContent from './MessageContent.svelte';
    import Role from './Role.svelte';

    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
    export let entry: models.Message;
</script>

<div class="message">
    <div class="left">
        {#if entry.author && entry.author.avatar_url}
            <img src={entry.author.avatar_url} alt="avatar" class="author-avatar" />
            <Tooltip noBackground>
                <img src={entry.author.avatar_url} alt="avatar" class="author-avatar-preview" />
            </Tooltip>
        {/if}
    </div>
    <div class="right">
        {#if entry.author}
            <div class="author-name">
                <span class="name">
                    {entry.author.name}
                </span>
                {#if entry.author.roles}
                    <div class="roles">
                        {#each entry.author.roles as role}
                            <Role role={role} />
                        {/each}
                    </div>
                {/if}
                <span class="id">
                    {entry.author.id}
                    @
                    {entry.room_id}
                </span>
            </div>
        {/if}
        {#if entry.content}
            <div class="message-content">
                <MessageContent component={entry.content} />
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
        border-bottom: 1px solid var(--color-bg-1);

        &:hover {
            background: var(--color-bg-1);
        }
    }

    .left {
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: center;
        height: fit-content;
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

    .author-name {
        display: flex;
        flex-direction: row;
        width: 100%;
        padding: 2px 0;
        font-size: 0.8rem;
        color: #666;
        user-select: text;

        .id {
            margin-right: 5px;
            margin-left: auto;
        }

        .roles {
            display: flex;
            flex-flow: row wrap;
            gap: 5px;
            overflow: hidden;
        }
    }
    .message-content {
        position: relative;
        margin-right: 14px;
        margin-bottom: 5px;
        overflow: clip;
        font-size: 0.9rem;
        overflow-wrap: break-word;
        user-select: text;
        contain: content;
    }
</style>
