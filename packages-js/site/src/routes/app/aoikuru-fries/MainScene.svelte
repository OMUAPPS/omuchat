<script context="module" lang="ts">
    import { property as p, type Scene } from '@omujs/flat';

    type Props = {
        path: Path2Property;
        handPos: Vec2Property;
    };
    export const MAIN_SCENE = {
        name: 'main',
        children: {},
        properties: {
            path: new p.Path2Property('path', [
                { x: 100, y: 100 },
                { x: 200, y: 200 },
                { x: 300, y: 300 },
                { x: 400, y: 400 },
            ]),
            handPos: new p.Vec2Property('handPos', { x: 100, y: 100 }),
        },
    };
</script>

<script lang="ts">
    import type { Path2Property } from '@omujs/flat/property/path2.js';
    import type { Vec2Property } from '@omujs/flat/property/vec2.js';
    import { onMount } from 'svelte';
    import Avatar from './Avatar.svelte';
    import BezierEdit from './BezierEdit.svelte';
    import { Bezier } from './bezier.js';
    import fries from './img/fries.png';
    import { DEBUG } from './stores.js';
    import DragPoint from './DragPoint.svelte';
    import { Timer } from './timer.js';

    export let scene: Scene<{}, Props>;
    const { path, handPos } = scene.properties;
    let timer = new Timer();
    let time = 0;

    onMount(() => {
        const update = () => {
            time = timer.getElapsedTime() / 1000;
            requestAnimationFrame(update);
        };
        update();
    });

    $: bezier = new Bezier(path.value);
    $: point = bezier.getPoint(Math.min(1, time));
</script>

{#if $DEBUG}
    <BezierEdit bind:path={path.value} />
{/if}

<DragPoint bind:x={handPos.value.x} bind:y={handPos.value.y} />
<Avatar position={handPos.value} />
<img src={fries} class="fries" alt="" style="left: {point.x}px; top: {point.y}px;" />

<style lang="scss">
    .fries {
        position: absolute;
        transform: translate(-50%, -100%);
        width: 100px;
    }
</style>
