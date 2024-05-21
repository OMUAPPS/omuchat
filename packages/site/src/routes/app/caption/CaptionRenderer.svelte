<script lang="ts">
    import { style } from '@omujs/ui';
    import type { CaptionApp } from './caption-app.js';

    export let captionApp: CaptionApp;
    const { config } = captionApp;

    let text = '';
    captionApp.listen((caption) => {
        text = caption.texts.join(' ');

        if (caption.final) {
            previosWidth = clientWidth;
        }
    });

    let previosWidth = 0;
    let clientWidth = 0;

    let fontFamily = '';
    $: {
        fontFamily = $config.style.fonts.map((font) => font.family).join(', ');
    }
</script>

{#each $config.style.fonts as font}
    <link href={font.url} rel="stylesheet" />
{/each}
{#if text}
    <div
        style={style({
            minWidth: `${previosWidth}px`,
        })}
    >
        <p
            bind:clientWidth
            style={style({
                fontFamily,
                fontSize: `${$config.style.fontSize}px`,
            })}
        >
            {text}
        </p>
    </div>
{/if}

<style lang="scss">
    div {
        display: flex;
        flex-direction: column;
        color: var(--color-1);
        background: var(--color-bg-2);
        align-items: center;
        margin: 0;
        padding: 1rem 2rem;
        width: fit-content;
        font-size: 2rem;
    }

    p {
        font-weight: bold;
        width: fit-content;
    }
</style>
