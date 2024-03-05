<script lang="ts">
    import { screenContext } from './screen.js';
    import ScreenHeader from './ScreenHeader.svelte';

    import { classes } from '$lib/utils/class-helper.js';

    export let title: string;
    export let windowed: boolean = true;
    export let noDecorated: boolean = false;
    export let noClose: boolean = false;
    let container: HTMLButtonElement;

    function onClick(event: MouseEvent) {
        if (event.target === container) {
            screenContext.pop();
        }
    }

    function onKeyPress(e: KeyboardEvent) {
        if (!noClose && e.key === 'Escape') {
            screenContext.pop();
        }
    }
</script>

<svelte:window on:keydown={onKeyPress} />

<button class="container" class:windowed on:click={onClick} bind:this={container}>
    <div class="screen" class:windowed>
        {#if !noDecorated && windowed}
            <ScreenHeader {title} />
        {/if}
        <div class:windowed class={classes('content', noDecorated && 'no-decorated')}>
            {#if !noDecorated && !windowed}
                <ScreenHeader {title} />
            {/if}
            <slot />
        </div>
    </div>
</button>

<style lang="scss">
    .container {
        position: absolute;
        inset: 0;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        appearance: none;
        background: color-mix(in srgb, var(--color-bg-1) 97%, transparent);
        border: none;
    }

    .screen {
        max-width: 100%;
        max-height: 100%;
        animation-fill-mode: forwards;

        &:not(.windowed) {
            width: 100%;
            height: 100%;
        }

        &.windowed {
            animation: menu-in 0.2s cubic-bezier(0, 1.14, 0, 1);
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        align-items: center;
        overflow: hidden;
        background: var(--color-bg-2);

        &.windowed {
            width: 500px;
            height: 300px;
            border: 2px solid var(--color-1);
            box-shadow: 0 8px 0 0 var(--color-2);
        }

        &:not(.windowed) {
            position: absolute;
            top: 40px;
            width: 100%;
            height: calc(100% - 40px);

            &:not(.no-decorated) {
                top: 40px;
            }
        }
    }

    @keyframes menu-in {
        0% {
            opacity: 0;
            transform: scale(0);
        }

        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
</style>
