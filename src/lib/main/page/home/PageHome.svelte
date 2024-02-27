<script lang="ts">
	import { writable } from 'svelte/store';

	import PanelApps from './PanelApps.svelte';

	import PanelMessages from '$lib/main/panel/messages/PanelMessages.svelte';
	import type { PanelEntry } from '$lib/main/panel/panel.js';
	import PanelProvider from '$lib/main/panel/PanelProvider.svelte';
	import PanelRooms from '$lib/main/panel/rooms/PanelRooms.svelte';

	const panels = writable<PanelEntry[]>([
		{
			icon: 'ti ti-bolt',
			name: '接続中',
			panel: () => ({ component: PanelRooms })
		},
		{
			icon: 'ti ti-message',
			name: 'コメント／メッセージ',
			width: 300,
			fit: true,
			panel: () => ({ component: PanelMessages })
		},
		{
			icon: 'ti ti-player-play',
			name: 'アプリ',
			panel: () => ({ component: PanelApps })
		}
	]);
</script>

<PanelProvider {panels} />
