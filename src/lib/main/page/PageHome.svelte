<script lang="ts">
	import PanelProvider from '$lib/panel/PanelProvider.svelte';
	import type { PanelEntry } from '$lib/panel/panel';
	import { writable } from 'svelte/store';
	import PanelMessages from '../panel/messages/PanelMessages.svelte';
	import PanelRooms from '../panel/rooms/PanelRooms.svelte';
	import PopupRoomsSettings from '../panel/rooms/PopupRoomsSettings.svelte';

	const panels = writable<PanelEntry[]>([
		{
			icon: 'ti ti-message',
			name: 'コメント／メッセージ',
			width: 300,
			fit: true,
			componentPanel() {
				return {
					component: PanelMessages,
					props: {}
				};
			},
			componentSettings() {
				return {
					component: PanelMessages,
					props: {}
				};
			}
		},
		{
			icon: 'ti ti-home',
			name: '接続中',
			componentPanel() {
				return {
					component: PanelRooms,
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
