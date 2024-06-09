<script lang="ts">
    import { DragHelper } from './utils/drag-helper.js';

    export let href: (() => string | URL) | string | URL;

    let preview: HTMLDivElement;

    function handleDragStart(event: DragEvent) {
        DragHelper.setDragImage(event, preview);
        const url = typeof href === 'function' ? href() : href;
        DragHelper.setUrl(event, url);
    }
</script>

<div class="container" on:dragstart={handleDragStart} draggable="true" role="form">
    <div class="preview" bind:this={preview}>
        <slot name="preview" />
    </div>
    <slot />
</div>

<style lang="scss">
    .preview {
        position: fixed;
        top: 0;
        left: 0;
        transform: translate(-100%, -100%);
    }

    .container {
        display: flex;
        flex-direction: column;
    }
</style>
