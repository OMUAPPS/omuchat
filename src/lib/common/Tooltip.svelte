<script lang="ts">
	export let text = '';

	let target: HTMLElement;
	let tooltip: HTMLElement;
	let show = false;
	type Rect = { x: number; y: number; width: number; height: number };
	let tooltipRect: Rect = {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	let targetRect: Rect = {
		x: 0,
		y: 0,
		width: 0,
		height: 0
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
					window.innerWidth - tooltipRect.width - padding
				),
				y: clamp(
					targetRect.y + targetRect.height + 10,
					padding,
					window.innerHeight - tooltipRect.height - padding
				)
			};
		}
	}
</script>

{#if show}
	<div class="tooltip" style="top: {tooltipPos.y}px; left: {tooltipPos.x}px;" bind:this={tooltip}>
		{text}
	</div>
	<div
		class="pointer"
		style="top: {targetRect.y + targetRect.height}px; left: {targetRect.x +
			targetRect.width / 2}px;"
	/>
{/if}
<button class="wrapper" bind:this={target} on:mouseenter={showTooltip} on:mouseleave={hideTooltip}>
	<slot />
</button>

<style lang="scss">
	.tooltip {
		position: fixed;
		pointer-events: none;
		position: fixed;
		z-index: 20;
		background: var(--color-text);
		color: #fff;
		padding: 5px 10px;
		border-radius: 0;
		font-size: 12px;
		font-weight: 600;
		white-space: nowrap;
		user-select: none;
		pointer-events: none;
	}

	.pointer {
		content: '';
		position: fixed;
		z-index: 20;
		border: 5px solid transparent;
		border-bottom-color: var(--color-text);
		user-select: none;
		pointer-events: none;
		transform: translateX(-50%);
	}

	.wrapper {
		appearance: none;
		border: none;
		background: none;
	}
</style>
