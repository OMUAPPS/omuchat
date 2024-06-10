<script lang="ts">
    import type { Path2 } from '@omujs/flat/property/path2.js';
    import DragPoint from './DragPoint.svelte';

    export let path: Path2;
    export const resolution = 100;
    let points: { x: number, y: number }[] = [];

    function bezier(t: number, p0: number, p1: number, p2: number, p3: number) {
        return Math.pow(1 - t, 3) * p0 + 3 * Math.pow(1 - t, 2) * t * p1 + 3 * (1 - t) * Math.pow(t, 2) * p2 + Math.pow(t, 3) * p3;
    }

    function updatePoints(path: Path2) {
        points = [];
        for (let i = 0; i < resolution; i++) {
            const t = i / resolution;
            const x = bezier(t, path[0].x, path[1].x, path[2].x, path[3].x);
            const y = bezier(t, path[0].y, path[1].y, path[2].y, path[3].y);
            points.push({ x, y });
        }
    }

    $: updatePoints(path);
</script>

{#each points as pos}
    <div style="left: {pos.x}px; top: {pos.y}px;" />
{/each}
{#each path as pos}
    <DragPoint bind:x={pos.x} bind:y={pos.y} />
{/each}

<style>
    div {
        position: absolute;
        width: 2px;
        height: 2px;
        background: black;
    }
</style>