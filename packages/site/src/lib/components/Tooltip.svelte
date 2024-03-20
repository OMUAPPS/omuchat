<script lang="ts">
    import { afterUpdate, onDestroy } from 'svelte';

    import { style } from '$lib/utils/class-helper.js';

    export let noBackground = false;

    let element: HTMLElement;
    let target: HTMLElement;
    let tooltip: HTMLElement;
    let show = false;
    type Rect = { x: number; y: number; width: number; height: number };
    let tooltipRect: Rect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };
    let targetRect: Rect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };
    let tooltipPos: { x: number; y: number } = { x: 0, y: 0 };

    function showTooltip() {
        show = true;
        targetRect = target.getBoundingClientRect();
    }

    function hideTooltip() {
        show = false;
    }

    function clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }

    $: {
        const padding = 5;
        if (target && tooltip) {
            tooltipRect = tooltip.getBoundingClientRect();
            tooltipPos = {
                x: clamp(
                    targetRect.x + targetRect.width / 2 - tooltipRect.width / 2,
                    padding,
                    window.innerWidth - tooltipRect.width - padding,
                ),
                y: clamp(
                    targetRect.y + targetRect.height + 10,
                    padding,
                    window.innerHeight - tooltipRect.height - padding,
                ),
            };
        }
    }

    afterUpdate(() => {
        if (!element.parentElement) {
            throw new Error('TooltipInline must be a child of another element');
        }
        target = element.parentElement;
        target.addEventListener('mouseenter', showTooltip);
        target.addEventListener('mouseleave', hideTooltip);
    });

    onDestroy(() => {
        if (!target) return;
        target.removeEventListener('mouseenter', showTooltip);
        target.removeEventListener('mouseleave', hideTooltip);
    });
</script>

<span class="wrapper" bind:this={element}>
    {#if show}
        <div
            class="tooltip"
            class:background={!noBackground}
            style={style({ top: `${tooltipPos.y}px`, left: `${tooltipPos.x}px` })}
            bind:this={tooltip}
        >
            <slot />
        </div>
        <div
            class="pointer"
            style={style({
                top: `${targetRect.y + targetRect.height}px`,
                left: `${targetRect.x + targetRect.width / 2}px`,
            })}
        />
    {/if}
</span>

<style lang="scss">
    .tooltip {
        position: fixed;
        z-index: 200;
        font-size: 12px;
        font-weight: 600;
        color: #fff;
        white-space: nowrap;
        pointer-events: none;
        user-select: none;

        &.background {
            padding: 5px 10px;
            background: #000;
        }
    }

    .pointer {
        position: fixed;
        z-index: 20;
        pointer-events: none;
        content: '';
        user-select: none;
        border: 5px solid transparent;
        border-bottom-color: #000;
        transform: translateX(-50%);
    }

    .wrapper {
        position: fixed;
        z-index: 200;
        width: 0;
        height: 0;
        appearance: none;
        background: none;
        border: none;
    }
</style>
