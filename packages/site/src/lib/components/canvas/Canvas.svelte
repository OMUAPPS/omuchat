<script lang="ts">
    import { onMount } from 'svelte';
    import { GlContext } from './glcontext.js';

    export let glContext: GlContext | undefined = undefined;
    export let canvas: HTMLCanvasElement | undefined = undefined;
    export let width: number = 0;
    export let height: number = 0;
    export let requestId: number | null = null;
    export let render: (gl: GlContext) => Promise<void>;
    export let init: (gl: GlContext) => Promise<void>;

    function resize() {
        if (!canvas) return;
        if (!glContext) return;
        canvas.width = width;
        canvas.height = height;
        glContext.gl.viewport(0, 0, width, height);
    }

    async function renderLoop() {
        if (!glContext) return;
        await render(glContext);
        requestId = requestAnimationFrame(renderLoop);
    }

    onMount(() => {
        if (!canvas) return;
        glContext = GlContext.create(canvas);
        resize();
        init(glContext).then(() => {
            renderLoop();
        });
        const resizeObserver = new ResizeObserver(() => {
            if (!canvas) return;
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            resize();
        });
        resizeObserver.observe(canvas);

        return () => {
            if (requestId) cancelAnimationFrame(requestId);
            if (glContext) glContext.destroy();
            resizeObserver.disconnect();
        };
    });
</script>

<canvas bind:this={canvas} bind:clientWidth={width} bind:clientHeight={height} />

<style lang="scss">
    canvas {
        width: 100%;
        height: 100%;
    }
</style>
