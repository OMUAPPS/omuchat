<script lang="ts" generics="_T extends Keyable">
	import TableListEntry from './TableListEntry.svelte';

	import type { Table } from '@omuchatjs/omu/extension/table/table.js';
	import type { Keyable } from '@omuchatjs/omu/interface/keyable.js';
	import { onMount, tick, type ComponentType, type SvelteComponent } from 'svelte';

	import { getClient } from './client.js';

	import VirtualList from '$lib/common/VirtualList.svelte';

	// eslint-disable-next-line no-undef
	type T = _T & Keyable;

	export let table: Table<T>;
	export let component: ComponentType<SvelteComponent<{ entry: T; selected?: boolean }>>;
	export let filter: (key: string, entry: T) => boolean = () => true;
	export let sort: (a: T, b: T) => number = () => 0;
	export let reverse: boolean = false;
	export let initial: number = 40;
	export let limit = 400;
	export let fitHeight = false;
	export let selectedItem: string | undefined = undefined;

	const { client } = getClient();
	let entries: Map<string, T> = new Map();
	let items: Array<[string, T]> = [];
	let addedItems: string[] = [];
	let startIndex = 0;
	let endIndex = 0;
	let updated = false;
	let viewport: HTMLDivElement;
	let last: string | undefined;
	let loadingLock = false;

	async function fetch() {
		if (!client.connection.connected) return;
		if (last) {
			const items = await table.fetch({
				cursor: last,
				before: initial
			});
			updateCache(items);
			update();
			return;
		}
		const items = await table.fetch({
			before: initial
		});
		updateCache(items);
		updated = false;
	}

	client.connection.addTask(async () => {
		entries.clear();
		fetch();
	});

	function updateCache(cache: Map<string, T>) {
		if (cache.size === 0) return;
		last = [...cache.entries()].pop()?.[0];
		let newItems = [...cache.entries()];
		if (filter) {
			newItems = newItems.filter(([key, entry]) => filter(key, entry));
		}
		if (newItems.length === 0) return;
		const length = [...entries.keys()].length;
		entries = new Map([...entries.entries(), ...newItems]);
		if (length !== [...entries.keys()].length) {
			updated = true;
		}
		if (startIndex === 0) {
			entries = new Map([...entries.entries()].slice(-limit));
		}
		return;
	}

	onMount(() => {
		table.listen((items) => {
			updateCache(items);
		});
		table.addListener({
			onRemove(items) {
				const keys = items.keys();
				let changed = false;
				for (const key of keys) {
					if (entries.delete(key)) {
						changed = true;
					}
				}
				if (changed) {
					updated = true;
				}
			},
			onUpdate(items) {
				let changed = false;
				for (const [key, value] of items.entries()) {
					if (filter && !filter(key, value)) {
						if (entries.delete(key)) {
							changed = true;
						}
						continue;
					}
					if (entries.get(key) === value) continue;
					entries.set(key, value);
					changed = true;
				}
				if (changed) {
					updated = true;
				}
			},
			onAdd(items) {
				addedItems = [...items.keys()];
			}
		});
		viewport.addEventListener('scroll', handleScroll);

		return () => {
			viewport.removeEventListener('scroll', handleScroll);
		};
	});

	function top() {
		startIndex = 0;
		viewport.scrollTo({ top: 0 });
	}

	function update() {
		items = Array.from(entries.entries());
		if (filter) {
			items = items.filter(([key, entry]) => filter(key, entry));
		}
		if (sort) {
			items = items.sort(([, entryA], [, entryB]) => sort(entryA, entryB));
		}
		if (reverse) {
			items = items.reverse();
		}
		updated = false;
	}

	$: {
		if (!items.length || (startIndex === 0 && updated)) {
			update();
		}
	}

	async function handleScroll(e: Event) {
		if (loadingLock) return;
		loadingLock = true;
		const target = e.target as HTMLDivElement;
		let { scrollTop, scrollHeight, clientHeight } = target;
		while (scrollTop + clientHeight >= scrollHeight - 4000) {
			await fetch();
			await tick();
			scrollHeight = target.scrollHeight;
		}
		loadingLock = false;
	}

	function handleSelectItem(e: KeyboardEvent) {
		if (items.length === 0) return false;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (!selectedItem) {
				selectedItem = items[startIndex][0];
				return true;
			}
			const index = items.findIndex(([key]) => key === selectedItem);
			if (index === -1) return true;
			if (index + 1 < items.length) {
				selectedItem = items[index + 1][0];
			}
			return true;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (!selectedItem) {
				selectedItem = items[startIndex][0];
				return true;
			}
			const index = items.findIndex(([key]) => key === selectedItem);
			if (index === -1) return true;
			if (index - 1 >= 0) {
				selectedItem = items[index - 1][0];
			}
			return true;
		}
		return false;
	}

	let average_height: number = 0;

	function scrollToSelected() {
		if (!selectedItem) return;
		let index = items.findIndex(([key]) => key === selectedItem);
		if (index === -1) return;
		if (index < startIndex + 1) {
			index = Math.max(0, index - 1);
			const row = index * average_height;
			viewport.scrollTo({ top: row, behavior: 'instant' });
			return;
		}
		if (index > endIndex - 3) {
			index = startIndex + 2;
			const row = index * average_height;
			viewport.scrollTo({ top: row, behavior: 'instant' });
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (handleSelectItem(e)) {
			scrollToSelected();
		}
	}

	function selectItem(key: string | undefined) {
		selectedItem = key;
	}
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="list" class:full={!fitHeight}>
	<div class="items">
		<VirtualList
			{items}
			bind:average_height
			bind:viewport
			bind:start={startIndex}
			bind:end={endIndex}
			let:key
			let:item
		>
			<TableListEntry
				selected={key === selectedItem}
				{key}
				{selectItem}
				transition={addedItems.includes(key)}
			>
				<svelte:component this={component} entry={item} selected={key === selectedItem} />
			</TableListEntry>
		</VirtualList>
	</div>
	{#if updated}
		<button class="update" on:click={top}>
			更新があります
			<i class="ti ti-chevron-up" />
		</button>
	{/if}
	<button class="loading" class:active={loadingLock}>
		<i class="ti ti-loader-2" />
	</button>
</div>

<style lang="scss">
	.list {
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.full {
		width: 100%;
		height: 100%;
	}

	.loading {
		position: absolute;
		bottom: 10px;
		right: 50%;
		transform: translateX(50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		font-size: 20px;
		color: var(--color-1);
		background: transparent;
		border: none;
		animation: spin 1s linear infinite;
		visibility: hidden;

		&.active {
			visibility: visible;
		}
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.update {
		position: absolute;
		top: 10px;
		right: 50%;
		display: flex;
		gap: 5px;
		align-items: baseline;
		justify-content: center;
		padding: 10px 14px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-bg-1);
		background: var(--color-1);
		border: none;
		border-radius: 50px;
		outline: none;
		transform: translateX(50%);

		i {
			font-size: 14px;
		}

		&:hover {
			outline: 2px solid var(--color-bg-1);
			outline-offset: -4px;
		}
	}

	.items {
		width: 100%;
		height: 100%;
	}
</style>
