<script lang="ts">
	import ButtonMini from '$lib/common/ButtonMini.svelte';
	import Component from '$lib/common/Component.svelte';
	import { getPopupContext } from '$lib/common/popup/popup';
	import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
	import { style } from '$lib/util/class-helper';
	import { onDestroy, onMount } from 'svelte';
	import { getPanelContext, type PanelEntry } from './panel';

	export let panel: PanelEntry;
	export let dragging = false;
	export let selected = false;

	const context = getPanelContext();
	const popup = getPopupContext();

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

	onMount(() => {
		window.addEventListener('mouseup', handleMouseUp);
		window.addEventListener('mousemove', handleMouseMove);
		panel.element = dragElement;
	});

	onDestroy(() => {
		window.removeEventListener('mouseup', handleMouseUp);
		window.removeEventListener('mousemove', handleMouseMove);
	});

	function openSettings() {
		popup.push({
			component: Component,
			props: {
				component: panel.component(),
				props: panel
			}
		});
	}
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
				<ButtonMini callback={openSettings}>
					<Tooltip>設定</Tooltip>
					<i class="ti ti-settings" />
				</ButtonMini>
			</div>
		</div>
		<div class="panel">
			<Component component={panel.component()} />
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		margin-top: 0px;
		height: 100%;
		background: var(--color-bg-1);

		&.dragging {
			transform: translateY(-10px);
			opacity: 0.6;
			pointer-events: none;

			.drag-wrapper {
				position: fixed;
			}
		}

		&.selected {
			outline: 2px solid var(--color-1);
			outline-offset: 2px;
		}
	}

	.drag-wrapper {
		width: 100%;
		height: 100%;
	}

	.header {
		height: 40px;
		width: 100%;
		padding-bottom: 10px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		* {
			transition: 0.03s;
		}

		&:hover > * {
			transition: 0.05s;
		}
	}

	.left {
		display: flex;
		align-items: center;
		font-size: 16px;
		width: 100%;
		appearance: none;
		border: none;
		background: none;
		cursor: grab;
		gap: 5px;
	}

	.right {
		visibility: hidden;
	}

	.container:hover {
		.right {
			visibility: visible;
		}
	}

	.header:hover {
		color: var(--color-1);
	}

	.dragging {
		cursor: grabbing;
		color: var(--color-1);
	}

	.panel {
		background: var(--color-bg-2);
		outline: 1px solid rgba(0, 0, 0, 0.1);
		height: calc(100% - 40px);
		width: 100%;
		overflow-y: auto;
	}
</style>
