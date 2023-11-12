<script lang="ts">
	import PanelProvider from '$lib/panel/PanelProvider.svelte';
	import type { PanelEntry } from '$lib/panel/panel';
	import { writable } from 'svelte/store';
	import PanelChannels from '../panel/channels/PanelChannels.svelte';
	import PopupRoomsSettings from '../panel/rooms/PopupRoomsSettings.svelte';

	const panels = writable<PanelEntry[]>([
		{
			icon: 'ti ti-home',
			name: 'チャンネル',
			componentPanel() {
				return {
					component: PanelChannels,
					props: {}
				};
			},
			componentSettings() {
				return { component: PopupRoomsSettings, props: {} };
			}
		}
	]);
</script>

<PanelProvider {panels} />
