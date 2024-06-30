<script lang="ts">
    import { Tooltip } from '@omujs/ui';
    import type { Message } from '../marshmallow-app.js';

    export let message: Message;
</script>

<div class="buttons">
    <button class="check">
        <Tooltip>確認済みにする</Tooltip>
        <i class="ti ti-check" />
    </button>
    <button class="like">
        <Tooltip>お気に入りにする</Tooltip>
        {#if message.liked}
            <i class="ti ti-heart-filled" />
        {:else}
            <i class="ti ti-heart" />
        {/if}
    </button>
    <button class="scroll">
        <Tooltip>スクロール同期を有効にする</Tooltip>
        <i class="ti ti-arrow-autofit-down" />
    </button>
</div>
<div class="message">
    <img src="https://media.marshmallow-qa.com/system/images/{message.message_id}.png" alt="" />
    <p>
        {message.content}
    </p>
</div>

<style lang="scss">
    .buttons {
        position: sticky;
        top: 0;
        display: flex;
        justify-content: flex-end;
        background: var(--color-bg-2);
        border-bottom: 1px solid var(--color-outline);
        padding: 0.5rem 1rem;

        > button {
            background: none;
            border: none;
            cursor: pointer;
            min-width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-1);
        }

        > .scroll {
            margin-left: auto;
        }
    }

    .message {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1rem;

        > img {
            max-width: 100%;
            border-radius: 4px;
        }

        > p {
            white-space: pre-wrap;
            word-wrap: break-word;
            width: 100%;
        }
    }
</style>
