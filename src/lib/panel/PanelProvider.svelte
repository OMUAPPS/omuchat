<script lang="ts">
	import PanelMessages from '$lib/main/panel/messages/PanelMessages.svelte';
	import PanelRooms from '$lib/main/panel/rooms/PanelRooms.svelte';
	import type { Message } from '@/omuchat';
	import { get, writable } from 'svelte/store';
	import Panel from './Panel.svelte';
	import { setPanelContext, type PanelContext, type PanelEntry } from './panel';

	let element: HTMLDivElement;
	const panels = writable<PanelEntry[]>([]);
	const selected = writable<PanelEntry | null>(null);
	const context: PanelContext = {
		panels,
		addPanel(panel: PanelEntry) {
			panels.update((panels) => [...panels, panel]);
		},
		removePanel(panel: PanelEntry) {
			panels.update((panels) => panels.filter((p) => p !== panel));
		},
		swapPanel(from: PanelEntry, to: PanelEntry) {
			if (!from.index) return;
			if (!to.index) return;
			const temp = get(from.index);
			from.index.set(get(to.index));
			to.index.set(temp);
		},
		updateDrag(panel: PanelEntry) {
			const rectFrom = panel.element!.getBoundingClientRect();
			for (const p of $panels) {
				if (p === panel) continue;
				const rectTo = p.element!.getBoundingClientRect();
				if (rectFrom.right > rectTo.left && rectFrom.left < rectTo.right) {
					$selected = p;
					return;
				}
			}
			$selected = null;
		},
		dragPanel(panel: PanelEntry) {
			if (!$selected) return;
			this.swapPanel(panel, $selected);
			$selected = null;
		}
	};
	setPanelContext(context);

	context.addPanel({
		icon: 'ti ti-message',
		name: 'コメント／メッセージ',
		width: 300,
		fit: true,
		component() {
			return {
				component: PanelMessages,
				props: {}
			};
		}
	});
	context.addPanel({
		icon: 'ti ti-message',
		name: 'ギフト／投げ銭',
		component() {
			return {
				component: PanelMessages,
				props: {
					filter: (message: Message) => !!(message.gift || message.paid)
				}
			};
		}
	});
	context.addPanel({
		icon: 'ti ti-home',
		name: '接続中',
		component() {
			return {
				component: PanelRooms,
				props: {}
			};
		}
	});

	$: $panels.forEach((p, i) => (p.index = writable(i)));
</script>

<div class="container" bind:this={element}>
	{#each $panels as panel}
		<Panel {panel} selected={$selected === panel} />
	{/each}
</div>

<style>
	.container {
		background: var(--color-bg-1);
		display: flex;
		flex-direction: row;
		padding: 10px;
		height: 100%;
		gap: 10px;
		width: 100%;
		overflow-x: scroll;
	}
</style>
