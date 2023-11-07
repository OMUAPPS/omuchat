<script lang="ts">
	import Button from '$lib/common/Button.svelte';
	import Component from '$lib/common/Component.svelte';
	import Tooltip from '$lib/common/Tooltip.svelte';
	import { getPopupContext } from '$lib/common/popup/popup';
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
	style={style({ minWidth: `${panel.width}px`, width: `283px`, order: `${$index}` })}
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
				<Tooltip text="設定">
					<Button callback={openSettings}>
						<i class="ti ti-settings" />
					</Button>
				</Tooltip>
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
		height: 30px;
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
			// transform: translateY(-5px);
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

		* {
			height: 30px;
			display: flex;
			align-items: center;
		}
	}

	.right {
		visibility: hidden;
		transform: translateY(-10px);
	}

	.container:hover {
		.right {
			visibility: visible;
		}
	}

	.grip {
		display: flex;
		align-items: center;
		justify-content: center;
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
		height: calc(100% - 30px);
		width: 100%;
	}
</style>
