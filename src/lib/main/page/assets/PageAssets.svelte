<script lang="ts">
	import { writable } from 'svelte/store';
	import AssetItem from './AssetItem.svelte';

	const assets = writable(
		Array.from({ length: 100 }, (_, i) => ({
			id: i,
			name: `asset ${i}`,
			icon: 'ti ti-package',
			thumbnail: `https://picsum.photos/seed/${i}/200/200`,
			description: `asset ${i} description`,
			tags: ['tag1', 'tag2', 'tag3'],
			type: 'image',
			url: `https://picsum.photos/seed/${i}/200/200`
		}))
	);
</script>

<div class="container">
	<div class="header">
		<i class="ti ti-package" />
		アセット
	</div>
	<div class="items">
		{#each $assets as asset}
			<AssetItem {asset} />
		{/each}
	</div>
</div>

<style lang="scss">
	.container {
		width: 100%;
		height: 100%;
		padding: 10px;
		padding-top: 20px;
		background: var(--color-bg-1);

		.header {
			display: flex;
			flex-direction: row;
			align-items: baseline;
			gap: 10px;
			color: var(--color-1);
			font-family: Noto Sans JP;
			font-size: 18px;
			font-style: normal;
			height: 40px;
			font-weight: 600;
			line-height: 0;
			user-select: none;
		}
	}
</style>
