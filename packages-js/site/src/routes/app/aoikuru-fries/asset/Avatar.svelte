<script lang="ts">
    import type { Writable } from 'svelte/store';
    import { frame, type State, type StateType } from '../state.js';
    import idle from './img/idle.png';
    import throwing from './img/throwing.png';
    import catching from './img/catching.png';
    import eating1 from './img/eating1.png';
    import eating2 from './img/eating2.png';
    import idle_start from './img/idle_start.png';
    import throw_many from './img/throw_many.png';
    import throw_many_hit from './img/throw_many_hit.png';

    export let state: Writable<State>;

    const images = {
        idle,
        throw_start: throwing,
        throwing,
        catching,
        eating: eating1,
        throw_many,
        throw_many_hit,
        idle_start,
    } satisfies Record<StateType, string>;

    $: {
        if ($state.type === 'catching') {
            setTimeout(() => {
                $state.type = 'eating';
            }, 10 * 33.3);
        }
        if ($state.type === 'eating') {
            setTimeout(() => {
                $state = { type: 'idle_start' };
            }, 50 * 33.3);
        }
        if ($state.type === 'idle_start') {
            setTimeout(() => {
                $state = { type: 'idle' };
            }, 8 * 33.3);
        }
        if ($state.type === 'throw_start') {
            $state = {
                ...$state,
                type: 'throwing',
            };
            setTimeout(() => {
                if ($state.type === 'throwing') {
                    $state = {
                        ...$state,
                        type: 'catching',
                    };
                }
            }, 200);
        }
        if ($state.type === 'throw_many') {
            setTimeout(() => {
                if ($state.type === 'throw_many') {
                    $state = {
                        ...$state,
                        type: 'throw_many_hit',
                    };
                }
            }, 90);
        }
        if ($state.type === 'throw_many_hit') {
            setTimeout(() => {
                if ($state.type === 'throw_many_hit') {
                    $state = {
                        ...$state,
                        type: 'idle_start',
                    };
                }
            }, 1000);
        }
    }

    let eatTime = 0;
</script>

{#if $state.type === 'eating'}
    {#if Math.floor((eatTime += $frame) / 250) % 2 === 0}
        <img src={eating1} alt="" />
    {:else}
        <img src={eating2} alt="" />
    {/if}
{:else}
    <img src={images[$state.type]} alt="" />
{/if}
<div class="preloader">
    <img src={idle} alt="" />
    <img src={throwing} alt="" />
    <img src={catching} alt="" />
    <img src={eating1} alt="" />
    <img src={eating2} alt="" />
    <img src={idle_start} alt="" />
</div>

<style lang="scss">
    img {
        position: fixed;
        left: 0px;
        top: 0px;
    }

    .preloader {
        display: none;
    }
</style>
