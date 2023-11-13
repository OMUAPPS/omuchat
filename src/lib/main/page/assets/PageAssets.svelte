<script lang="ts">
	import InputText from '$lib/common/input/InputText.svelte';
	import { writable } from 'svelte/store';
	import AssetItem from './AssetItem.svelte';
	import type { Asset, AssetType } from './asset';

	const assets = writable<Asset[]>(
		Array.from({ length: 100 }, (_, i) => ({
			id: i,
			name: `アセット ${i}`,
			type: ['app', 'image', 'panel'][i % 3] as AssetType,
			thumbnail: `https://picsum.photos/seed/${i}/200/200`,
			description: `asset ${i} description`,
			tags: ['tag1', 'tag2', 'tag3'],
			url: `https://picsum.photos/seed/${i}/200/200`
		}))
	);

	const search = writable('');
</script>

<div class="container">
	<div class="header">
		<div class="title">
			<i class="ti ti-package" />
			アセット
		</div>
		<div>
			<InputText placeholder="検索" bind:value={$search} />
		</div>
	</div>
	<div class="items">
		{#each $assets.filter((asset) => asset.name.includes($search)) as asset}
			<AssetItem {asset} />
		{/each}
	</div>
</div>

<style lang="scss">
	.container {
		width: 100%;
		height: calc(100vh - 80px);
		padding: 40px;
		padding-bottom: 80px;
		margin-top: 80px;
		overflow-y: scroll;
		background: var(--color-bg-1);

		.header {
			position: fixed;
			top: 40px;
			left: 40px;
			z-index: 1;
			display: flex;
			flex-direction: row;
			gap: 40px;
			align-items: center;
			width: 100%;
			height: 80px;
			padding: 40px;
			color: var(--color-1);
			background: var(--color-bg-2);
			border-bottom: 1px solid var(--color-1);

			.title {
				display: flex;
				flex-direction: row;
				gap: 10px;
				align-items: baseline;
				font-size: 18px;
				font-weight: 600;
				color: var(--color-1);
			}
		}

		.items {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			grid-gap: 30px;
			padding: 0;
		}
	}
</style>
