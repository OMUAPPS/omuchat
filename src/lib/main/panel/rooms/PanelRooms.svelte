<script lang="ts">
	import Button from '$lib/common/Button.svelte';
	import FlexRowWrapper from '$lib/common/FlexRowWrapper.svelte';
	import { getClient } from '$lib/common/omuchat/omuchat';
	import { ClipboardHelper } from '$lib/util/clipboard-helper';
	import type { RoomInfo } from '@/omuchat';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Tooltip from '../../../common/tooltip/Tooltip.svelte';

	export let filter: (message: RoomInfo) => boolean = () => true;

	const client = getClient();

	const rooms = writable(client.rooms.cache);

	client.rooms.listen((newRooms) => {
		rooms.set(newRooms);
	});

	onMount(async () => {
		rooms.set(await client.rooms.fetch());
	});
</script>

<div class="rooms">
	{#each Object.values($rooms).filter(filter) as room}
		<div class="room">
			<div class="top">
				<img src={room.image_url} alt="thumbnail" class="room-thumbnail" />
				<FlexRowWrapper>
					<Button
						rounded
						callback={() => {
							if (!room.viewers) return;
							ClipboardHelper.writeText(room.viewers.toString());
						}}
					>
						<Tooltip>視聴者数（クリックでコピー）</Tooltip>
						<i class="ti ti-user" />
					</Button>
					<Button
						rounded
						callback={() => {
							if (!room.viewers) return;
							ClipboardHelper.writeText(room.viewers.toString());
						}}
					>
						<Tooltip>視聴者数（クリックでコピー）</Tooltip>
						<i class="ti ti-user" />
					</Button>
					<Button
						rounded
						callback={() => {
							if (!room.viewers) return;
							ClipboardHelper.writeText(room.viewers.toString());
						}}
					>
						<Tooltip>視聴者数（クリックでコピー）</Tooltip>
						<i class="ti ti-user" />
					</Button>
				</FlexRowWrapper>
			</div>
			<div class="bottom">
				<div class="room-name">
					<Tooltip>
						{room.name}
					</Tooltip>
					{room.name}
				</div>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.rooms {
		display: flex;
		flex-direction: column;
		// gap: 10px;
	}

	.room {
		padding: 5px;
		border-radius: 5px;
		background: var(--color-bg-2);
		&:hover {
			background: var(--color-bg-1);
		}
	}

	.room-thumbnail {
		width: 100px;
	}

	.room-name {
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;

		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
</style>
