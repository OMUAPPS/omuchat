<script lang="ts">
    import { onMount } from 'svelte';

    import { getPanelContext, type PanelEntry } from './panel.js';

    import PropedComponent from '$lib/common/component/PropedComponent.svelte';
    import ButtonMini from '$lib/common/input/ButtonMini.svelte';
    import { screenContext } from '$lib/common/screen/screen.js';
    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
    import { t } from '$lib/i18n/i18n-context.js';
    import { style } from '$lib/utils/class-helper.js';

    export let panel: PanelEntry;
    export let dragging = false;
    export let selected = false;

    const context = getPanelContext();

    const index = panel.index;
    let element: HTMLDivElement;
    let dragElement: HTMLDivElement;
    let offset = { x: 0, y: 0 };

    function handleMouseMove(event: MouseEvent) {
        if (dragging) {
            dragElement.style.left = `${event.clientX - offset.x}px`;
            context.updateDrag(panel, event.clientX - offset.x);
        }
    }

    function handleMouseDown(event: MouseEvent) {
        dragging = true;
        offset = {
            x: event.clientX - dragElement.clientLeft,
            y: event.clientY - dragElement.clientTop
        };
        handleMouseMove(event);
    }

    function handleMouseUp(event: MouseEvent) {
        if (!dragging) return;
        dragging = false;
        context.dragPanel(panel, event.clientX - offset.x);
    }

    function openSettings() {
        screenContext.push(panel.componentSettings());
    }

    onMount(() => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        panel.element = dragElement;

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    });
</script>

<div
    class="container"
    class:dragging
    class:selected
    style={style({
        minWidth: `${panel.width || 250}px`,
        width: panel.fit ? `100%` : `283px`,
        order: `${$index}`
    })}
    bind:this={element}
>
    <div class="drag-wrapper" bind:this={dragElement}>
        <div class="header">
            <button class="left" on:mousedown={handleMouseDown}>
                <i class={panel.icon} />
                <div>
                    {panel.name}
                </div>
            </button>
            <div class="right">
                <ButtonMini on:click={openSettings}>
                    <Tooltip>{$t("general.settings")}</Tooltip>
                    <i class="ti ti-settings" />
                </ButtonMini>
            </div>
        </div>
        <div class="panel">
            <PropedComponent component={panel.componentPanel()} />
        </div>
    </div>
</div>

<style lang="scss">
    .container {
        height: 100%;
        margin-top: 0;
        background: var(--color-bg-1);

        .drag-wrapper {
            width: 100%;
            height: 100%;
        }

        &.dragging {
            pointer-events: none;
            opacity: 1;
            transform: translateY(-10px);

            .drag-wrapper {
                position: fixed;
            }
        }

        &.selected {
            pointer-events: none;
            opacity: 0.3;
        }
    }

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        height: 40px;
        padding-bottom: 5px;
    }

    .left {
        display: flex;
        gap: 8px;
        align-items: center;
        width: 100%;
        padding-left: 1px;
        font-size: 14px;
        font-weight: 600;
        color: var(--color-1);
        appearance: none;
        cursor: grab;
        background: none;
        border: none;

        i {
            font-size: 18px;
        }
    }

    .right {
        display: flex;
        align-items: center;
        visibility: hidden;
    }

    .container:hover {
        .right {
            visibility: visible;
        }
    }

    .dragging {
        cursor: grabbing;
    }

    .panel {
        width: 100%;
        height: calc(100% - 40px);
        max-height: calc(100% - 40px);
        overflow: hidden;
        background: var(--color-bg-2);
        outline: 1px solid var(--color-outline);
    }
</style>
