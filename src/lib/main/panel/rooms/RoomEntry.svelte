<script lang="ts">
	import type { models } from '@omuchatjs/chat';

	import FlexRowWrapper from '$lib/common/FlexRowWrapper.svelte';
	import ButtonMini from '$lib/common/input/ButtonMini.svelte';
	import { getClient } from '$lib/common/omuchat/client.js';
	import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
	import { ClipboardHelper } from '$lib/utils/clipboard-helper.js';

	export let entry: models.Room;
	export let selected: boolean = false;

	const { client } = getClient();

	function open() {
		window.open(entry.metadata?.url, '_blank');
	}

	function copyViewers() {
		if (!entry.metadata?.viewers) return;
		ClipboardHelper.writeText(entry.metadata?.viewers.toString());
	}
</script>

<article class="room" class:selected>
	<div class="top">
		<div>
			{#if entry.metadata && entry.metadata.thumbnail}
				<img src={client.proxy(entry.metadata.thumbnail)} alt="thumbnail" class="room-thumbnail" />
				<Tooltip noBackground>
					<img
						src={client.proxy(entry.metadata.thumbnail)}
						alt="thumbnail"
						class="room-thumbnail-preview"
					/>
				</Tooltip>
			{/if}
		</div>
		<div class="buttons">
			<FlexRowWrapper widthFull>
				<ButtonMini on:click={open}>
					<Tooltip>見る</Tooltip>
					<i class="ti ti-external-link" />
				</ButtonMini>
			</FlexRowWrapper>
			<FlexRowWrapper widthFull between>
				{#if entry.metadata}
					<ButtonMini on:click={copyViewers}>
						<Tooltip>視聴者数（クリックでコピー）</Tooltip>
						{entry.metadata.viewers}
						<i class="ti ti-user" />
					</ButtonMini>
				{/if}
				<i class={`online-state ti ti-bolt ${entry.connected ? 'online' : 'offline'}`}>
					<Tooltip>{entry.connected ? '接続済み' : '切断済み'}</Tooltip>
				</i>
			</FlexRowWrapper>
		</div>
	</div>
	<div>
		{#if entry.metadata}
			<div class="room-name">
				<Tooltip>
					{entry.metadata.title}
				</Tooltip>
				{entry.metadata.title}
			</div>
			<div class="room-name">
				<Tooltip>
					{entry.metadata.description}
				</Tooltip>
				{entry.metadata.description}
			</div>
		{/if}
	</div>
</article>

<style lang="scss">
	article {
		padding: 10px;
		background: var(--color-bg-2);

		&.selected {
			background: var(--color-bg-1);
			outline: 1px solid var(--color-1);
			outline-offset: -4px;
		}

		border-bottom: 1px solid var(--color-bg-1);
	}

	.top {
		display: flex;
		flex-direction: row;
		width: 100%;
	}

	.buttons {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
		height: 20px;
		margin-left: 5px;
	}

	.online-state {
		margin-left: 5px;
	}

	.online {
		color: var(--color-1);
	}

	.offline {
		color: #ccc;
	}

	.room-thumbnail {
		width: 100px;
		min-width: 100px;
		min-height: 56px;
		object-fit: contain;
	}

	.room-thumbnail-preview {
		width: 300px;
		object-fit: contain;
		outline: 2px solid #000;
	}

	.room-name {
		overflow: hidden;
		font-size: 12px;
		color: rgba($color: #000, $alpha: 50%);
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
