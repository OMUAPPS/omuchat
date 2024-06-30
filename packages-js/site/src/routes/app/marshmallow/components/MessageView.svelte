<script lang="ts">
    import { Tooltip } from '@omujs/ui';
    import type { MarshmallowApp, Message } from '../marshmallow-app.js';
    import { onMount } from 'svelte';

    export let marshmallow: MarshmallowApp;
    export let message: Message;
    const { config, data } = marshmallow;

    let container: HTMLElement;
    let image: HTMLImageElement;

    function handleScroll(e: Event) {
        const target = e.target as HTMLElement;
        let scroll = target.scrollTop;
        const imageHeight = image.clientHeight;
        const imageTop = image.offsetTop;
        scroll = (scroll - imageTop) / imageHeight;
        $data.scroll = scroll;
        console.log(scroll);
    }

    onMount(() => {
        const parent = container.parentElement;
        if (!parent) {
            throw new Error('Parent not found');
        }
        parent.addEventListener('scroll', handleScroll);

        return () => {
            parent.removeEventListener('scroll', handleScroll);
        };
    });
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
    <button
        class="scroll"
        class:active={$config.syncScroll}
        on:click={() => {
            $config.syncScroll = !$config.syncScroll;
        }}
    >
        <Tooltip>
            {#if $config.syncScroll}
                スクロール同期を無効にする
            {:else}
                スクロール同期を有効にする
            {/if}
        </Tooltip>
        <i class="ti ti-arrow-autofit-down" />
    </button>
</div>
<div bind:this={container}>
    <div class="message">
        <img
            src="https://media.marshmallow-qa.com/system/images/{message.message_id}.png"
            alt=""
            bind:this={image}
        />
        <p>
            {message.content}
        </p>
    </div>
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

            &.active {
                background: var(--color-1);
                color: var(--color-bg-2);
            }
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
