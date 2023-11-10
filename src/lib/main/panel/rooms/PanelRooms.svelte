<script lang="ts">
	import { getClient } from '$lib/common/omuchat/omuchat';
	import type { RoomInfo } from '@/omuchat';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import RoomEntry from './RoomEntry.svelte';

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
		<RoomEntry {room} />
	{/each}
</div>

<style lang="scss">
	.rooms {
		display: flex;
		flex-direction: column;
	}
</style>
