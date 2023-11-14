<script lang="ts">
	import ButtonMini from '$lib/common/ButtonMini.svelte';
	import { getClient } from '$lib/common/omuchat/omuchat';
	import type { ChannelInfo } from '@/omuchat';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { popupContext } from '../../../common/popup/popup';
	import PopupSetup from '../../setup/PopupSetup.svelte';
	import ChannelEntry from './ChannelEntry.svelte';

	export let filter: (message: ChannelInfo) => boolean = () => true;

	const client = getClient();

	const channels = writable(client.channels.cache);

	client.channels.listen((newChannels) => {
		channels.set(newChannels);
	});

	onMount(async () => {
		channels.set(await client.channels.fetch());
	});

	function openSetup() {
		popupContext.push({
			component: PopupSetup,
			props: {}
		});
	}
</script>

<div class="container">
	<div class="buttons">
		<ButtonMini>
			<i class="ti ti-plus" />
			追加する
		</ButtonMini>
		<ButtonMini callback={openSetup}>
			<i class="ti ti-plus" />
			簡単セットアップ
		</ButtonMini>
	</div>
	{#each Object.values($channels).filter(filter) as channel}
		<ChannelEntry {channel} />
	{/each}
</div>

<style lang="scss">
	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		padding-top: 40px;
	}

	.buttons {
		position: absolute;
		top: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 40px;
		padding: 0 10px;
		outline: 1px solid var(--color-bg-1);
	}
</style>
