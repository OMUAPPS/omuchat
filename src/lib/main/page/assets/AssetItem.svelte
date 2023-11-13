<script lang="ts">
	import { DragHelper } from '$lib/util/drag-helper';
	import { TYPE_ICONS, type Asset } from './asset';

	export let asset: Asset;
	let preview: HTMLDivElement;

	function handleDragStart(event: DragEvent) {
		DragHelper.setDragImage(event, preview);
		DragHelper.setUrl(event, asset.url);
	}
</script>

<div class="container" on:dragstart={handleDragStart} draggable="true" role="form">
	<div class="header">
		<i class={TYPE_ICONS[asset.type]} />
		<div class="asset-name">{asset.name}</div>
	</div>
	<div class="asset">
		<img src={asset.thumbnail} alt="" />
		<div class="description">
			<div class="tags">
				{asset.tags.join(', ')}
			</div>
			<div class="drag-area">
				<i class="ti ti-drag-drop" />
				ドラッグアンドドロップして追加できます
			</div>
		</div>
	</div>
	<div class="preview" bind:this={preview}>
		<img src={asset.thumbnail} alt="" />
		<div>
			<i class={TYPE_ICONS[asset.type]} />
			{asset.name}
		</div>
	</div>
</div>

<style lang="scss">
	.preview {
		position: fixed;
		top: 0;
		left: 0;
		transform: translate(-100%, -100%);

		img {
			width: 250px;
			height: 140px;
		}

		div {
			position: absolute;
			top: 0;
			right: 0;
			padding: 10px;
			font-size: 16px;
			font-weight: 600;
			line-height: 0;
			color: var(--color-1);
			background: var(--color-bg-2);
		}
	}

	.container {
		display: flex;
		flex-direction: column;
	}

	.header {
		position: relative;
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: baseline;
		padding: 10px;
		padding-left: 0;
		font-size: 14px;
		font-weight: 600;
		line-height: 0;
		color: var(--color-1);
	}

	.asset {
		display: flex;
		flex-direction: row;
		gap: 10px;
		width: 100%;
		height: 130px;
		overflow: hidden;
		font-size: 18px;
		font-style: normal;
		color: var(--color-1);
		cursor: pointer;
		background: var(--color-bg-2);

		img {
			top: 0;
			left: 0;
			width: 300px;
			height: 100%;
			object-fit: cover;
		}

		.description {
			top: 0;
			left: 0;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: space-between;
			width: 100%;
			height: 100%;
			padding: 10px;

			.tags {
				font-size: 12px;
				color: var(--color-1);
			}

			.drag-area {
				display: none;
				align-items: center;
				justify-content: center;
				font-size: 12px;
				font-weight: 600;
				color: var(--color-1);
				white-space: nowrap;

				i {
					font-size: 24px;
				}
			}
		}

		&:hover {
			margin-left: -5px;
			outline: 2px solid var(--color-1);
			box-shadow: 5px 5px 0 2px var(--color-2);
			transition: 0.1s;

			img {
				opacity: 0.2;
			}

			.description {
				.drag-area {
					display: flex;
				}
			}
		}
	}
</style>
