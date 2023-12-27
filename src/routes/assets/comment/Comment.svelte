<script lang="ts">
    import type { models } from "@omuchat/client";

    import { chat } from "./chat";

    import MessageContent from "$lib/main/panel/messages/MessageContent.svelte";

    export let message: models.Message;

    let author: models.Author | undefined;

    async function getAuthor() {
        if (author) return;
        if (message.author_id) {
            author = await chat.authors.get(message.author_id);
        }
    }

    getAuthor();
</script>

<div class="message">
    {#if message.author_id}
        <div class="author">
            {#if author}
                {#if author.avatar_url}
                    <div class="author-icon">
                        <img src={author.avatar_url} alt="" />
                    </div>
                {/if}
                <div class="author-name">
                    {author.name}
                </div>
            {/if}
        </div>
    {/if}
    {#if message.content}
        <div class="content">
            <MessageContent component={message.content} />
        </div>
    {/if}
</div>


<style lang="scss">
    .message {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
        width: 100%;
        height: fit-content;
        font-size: 14px;
        font-weight: 600;
        color: var(--color-1);
        animation: fadein 0.2s ease-in-out;
    }

    @keyframes fadein {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .author {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
        width: 100%;
        height: 40px;
        font-size: 14px;
        font-weight: 600;
        color: var(--color-1);
    }

    .author-name {
        padding: 2px 4px;
        font-size: 16px;
        font-weight: 500;
        color: var(--color-bg-2);
        background: var(--color-1);
    }

    .author-icon {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        font-size: 18px;
        color: var(--color-1);

        img {
            width: 42px;
            height: 42px;
            border-radius: 50%;
        }
    }

    .content {
        padding: 10px 20px;
        margin-bottom: 40px;
        margin-left: 20px;
        font-size: 22px;
        font-weight: bold;
        color: var(--color-text);
        text-align: start;
        background: var(--color-bg-2);
    }
</style>