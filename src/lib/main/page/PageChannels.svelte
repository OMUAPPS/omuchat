<script lang="ts">
    import { writable } from 'svelte/store';

    import PanelChannels from '../panel/channels/PanelChannels.svelte';
    import type { PanelEntry } from '../panel/panel.js';
    import PanelProvider from '../panel/PanelProvider.svelte';
    import PanelRooms from '../panel/rooms/PanelRooms.svelte';

    const panels = writable<PanelEntry[]>([
        {
            icon: 'ti ti-bolt',
            name: 'ルーム',
            panel: () => ({ component: PanelRooms, props: {} }),
        },
        {
            icon: 'ti ti-home',
            name: 'チャンネル',
            fit: true,
            panel: () => ({ component: PanelChannels, props: {} }),
        },
    ]);
</script>

<PanelProvider {panels} />
