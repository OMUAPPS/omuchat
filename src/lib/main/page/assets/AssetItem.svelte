<script lang="ts">
	import { TYPE_ICONS, type Asset } from './asset';

	export let asset: Asset;
</script>

<div class="asset">
	<img src={asset.thumbnail} alt="" />
	<div class="header">
		<i class={TYPE_ICONS[asset.type]} />
		<div class="asset-name">{asset.name}</div>
	</div>
</div>

<style lang="scss">
	.asset {
		position: relative;
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: baseline;
		width: 250px;
		height: 140px;
		padding: 5px;
		padding-top: 5px;
		overflow: hidden;
		font-size: 18px;
		font-style: normal;
		color: var(--color-1);
		background: var(--color-bg-2);
		outline: 1px solid var(--color-1);

		img {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.header {
			position: relative;
			display: flex;
			flex-direction: row;
			gap: 10px;
			align-items: baseline;
			padding: 10px;
			font-size: 14px;
			font-weight: 600;
			line-height: 0;
			color: var(--color-1);
			background: var(--color-bg-2);
		}
	}
</style>
