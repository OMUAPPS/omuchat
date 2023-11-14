<script lang="ts">
	import ButtonMini from '../../common/ButtonMini.svelte';
	import Component from '../../common/component/PropedComponent.svelte';
	import { popupContext } from '../../common/popup/popup';
	import Tooltip from '../../common/tooltip/Tooltip.svelte';
	import { style } from '../../util/class-helper';
	import { onMount } from 'svelte';
	import { getPanelContext, type PanelEntry } from './panel';

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
		popupContext.push(panel.componentSettings());
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
				<ButtonMini callback={openSettings}>
					<Tooltip>設定</Tooltip>
					<i class="ti ti-settings" />
				</ButtonMini>
			</div>
		</div>
		<div class="panel">
			<Component component={panel.componentPanel()} />
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		height: 100%;
		margin-top: 0;
		background: var(--color-bg-1);

		&.dragging {
			pointer-events: none;
			opacity: 0.6;
			transform: translateY(-10px);

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
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		height: 40px;
		padding-bottom: 10px;

		* {
			transition: 0.03s;
		}

		&:hover > * {
			transition: 0.05s;
		}
	}

	.left {
		display: flex;
		gap: 5px;
		align-items: center;
		width: 100%;
		font-size: 16px;
		appearance: none;
		cursor: grab;
		background: none;
		border: none;
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
		color: var(--color-1);
		cursor: grabbing;
	}

	.panel {
		width: 100%;
		height: calc(100% - 40px);
		overflow-y: auto;
		background: var(--color-bg-2);
		outline: 1px solid rgb(0 0 0 / 10%);
	}
</style>
