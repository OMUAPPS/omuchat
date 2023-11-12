<script lang="ts">
	import type { Asset } from './asset';

	export let asset: Asset;
</script>

<div class="asset">
	<div class="asset-icon">
		<img src={asset.icon} alt={asset.name} />
	</div>
	<div class="asset-name">{asset.name}</div>
</div>

<style>
	.asset {
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
</style>
