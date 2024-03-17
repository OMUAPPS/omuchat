<script lang="ts">
    import { writable } from 'svelte/store';

    import PanelProvider from '$lib/main/panel/PanelProvider.svelte';
    import PanelMessages from '$lib/main/panel/messages/PanelMessages.svelte';
    import type { PanelEntry } from '$lib/main/panel/panel.js';
    import PanelRooms from '$lib/main/panel/rooms/PanelRooms.svelte';
    import PanelApps from './PanelApps.svelte';

    const panels = writable<PanelEntry[]>([
        {
            icon: 'ti ti-bolt',
            name: '接続中',
            component: PanelRooms,
            props: {},
        },
        {
            icon: 'ti ti-message',
            name: 'コメント／メッセージ',
            width: 300,
            fit: true,
            component: PanelMessages,
            props: {},
        },
        {
            icon: 'ti ti-player-play',
            name: 'アプリ',
            component: PanelApps,
            props: {},
        },
    ]);
</script>

<PanelProvider {panels} />
