<script lang="ts">
    import { onMount } from "svelte";

    import { emojis, reactions, type Reaction } from "./reaction";

    export let reaction: Reaction;
    let [x, y] = [
        Math.random() * (window.innerWidth - 100),
        Math.random() * (window.innerHeight - 300) + 250,
    ];
    let opacity = 0;
    let rotation = 0;
    let vx = Math.random() - 0.5
    let animationFrameHandle: number;
    const time = Date.now();
    let elapsed = 0;

    function update() {
        if (elapsed > 100) {
            reactions.update((map) => {
                map.delete(reaction.id);
                return map;
            });
            return;
        }
        elapsed = (Date.now() - time) / 16;
        y -= Math.pow(elapsed, 0.2);
        vx += Math.sin(elapsed / 15) / 3
        vx *= 0.8;
        x += vx;
        opacity = Math.min(1, elapsed / 10) - Math.max(0, (elapsed - 50) / 50);
        rotation = Math.sin(elapsed / 15 + 1) * 5;
        animationFrameHandle = requestAnimationFrame(update);
    }

    onMount(() => {
        animationFrameHandle = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(animationFrameHandle);
        }
    });
</script>

<div class="reaction" style=" opacity: {opacity};transform: translate({x}px, {y}px) rotate({rotation}deg);">
    <!-- {reaction.key} -->
    {#if emojis.has(reaction.key)}
        {#if emojis.get(reaction.key)}
            <img src={emojis.get(reaction.key)} alt="" />
        {:else}
            {reaction.key}
        {/if}
    {:else}
        {reaction.key}
    {/if}
</div>

<style>
    @import 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap';
    @import 'https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap';

    .reaction {
        position: fixed;
        top: 0;
        left: 0;
        font-family: 'Noto Color Emoji', 'Noto Sans JP', sans-serif;
        font-size: 32px;
        transform: translate(-50%, -50%);
    }

    img {
        max-width: 64px;
        max-height: 64px;
    }
</style>