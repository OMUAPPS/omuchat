<script lang="ts">
	import Button from '$lib/common/Button.svelte';
	import FlexRowWrapper from '$lib/common/FlexRowWrapper.svelte';
	import { getClient } from '$lib/common/omuchat/omuchat';
	import type { RoomInfo } from '@/omuchat';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import RoomEntry from './RoomEntry.svelte';

	export let filter: (message: RoomInfo) => boolean = () => true;

	const client = getClient();
	const rooms = writable(Object.values(client.rooms.cache));
	let showOffline = false;

	function update(newRooms: Record<string, RoomInfo>) {
		rooms.set(Object.values(newRooms).filter(filter));
	}

	client.rooms.listen(update);

	function toggleOffline() {
		showOffline = !showOffline;
	}

	onMount(async () => {
		update(await client.rooms.fetch());
	});
</script>

<div class="rooms">
	{#each $rooms.filter((room) => room.online) as room}
		<RoomEntry {room} />
	{/each}
	<Button callback={toggleOffline}>
		<FlexRowWrapper widthFull reverse>
			{#if showOffline}
				<i class="ti ti-chevron-up" />
				オンラインのみ表示
			{:else}
				<i class="ti ti-chevron-down" />
				オフラインも表示する
			{/if}
		</FlexRowWrapper>
	</Button>
	{#if showOffline}
		{#each $rooms.filter((room) => !room.online) as room}
			<RoomEntry {room} />
		{/each}
	{/if}
</div>

<style lang="scss">
	.rooms {
		display: flex;
		flex-direction: column;
	}
</style>
