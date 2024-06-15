<script lang="ts">
    import { SvgPath } from '$lib/math/bezier.js';
    import { onMount } from 'svelte';
    import type { Writable } from 'svelte/store';
    import type { State } from '../state.js';
    import fries from './img/fries.png';

    export let state: Writable<State>;
    let svg: SVGPathElement;
    let time = 0;
    let lastTime = 0;

    onMount(() => {
        let animationFrameId = 0;
        lastTime = Date.now();
        const update = () => {
            const now = Date.now();
            time += ((now - lastTime) / 1000) * 7;
            lastTime = now;
            animationFrameId = requestAnimationFrame(update);
        };
        update();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    });

    $: path = svg && new SvgPath(svg);
    $: point = path && path.getPoint(Math.pow(time, 1.1));

    $: {
        if ($state.type === 'throw_start') {
            time = 0;
            $state = {
                ...$state,
                type: 'throwing',
            };
        }
        if (time > 1 && $state.type === 'throwing') {
            console.log('catching');
            $state = {
                ...$state,
                type: 'catching',
            };
        }
    }
</script>

<svg width="100%" height="100%" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
    <path bind:this={svg} d="M1431.5 307.5C873 1.49998 390.5 -76.0001 1 96.9999" />
</svg>

{#if point && $state.type === 'throwing'}
    <div
        class="fries"
        style="
            left: {870 + point.x / 2}px;
            top: {750.04 + point.y / 2}px;"
    >
        <img
            src={fries}
            alt=""
            style="
            transform: rotate({time * -40 + 30}deg)"
        />
    </div>
{/if}
{#if 'thrower' in $state}
    {#key $state.thrower}
        <p>
            {$state.thrower}が🍟を投げた！
        </p>
    {/key}
{/if}

<style lang="scss">
    .fries {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 200px;
        object-fit: cover;
        offset-rotate: auto;
        animation: move 1s linear infinite;
    }

    p {
        position: absolute;
        right: 24px;
        bottom: 160px;
        text-align: start;
        padding: 5px 20px;
        white-space: nowrap;
        font-family: 'RocknRoll One', sans-serif;
        font-size: 32px;
        text-shadow: 2px 2px 0px #fff;
        animation: move 0.12s cubic-bezier(0.51, 0.08, 0.82, 0.59) forwards;
    }

    @keyframes move {
        0% {
            opacity: 0;
            transform: translateX(-15px) scaleY(0.5);
        }
        40% {
            opacity: 1;
            transform: translateX(10px) scaleY(0.9);
        }
        100% {
            transform: translateY(0) scaleY(1);
        }
    }
</style>
