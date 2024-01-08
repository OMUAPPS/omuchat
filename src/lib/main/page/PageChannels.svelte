<script lang="ts">
    import { writable } from 'svelte/store';

    import PanelChannels from '../panel/channels/PanelChannels.svelte';
    import type { PanelEntry } from '../panel/panel.js';
    import PanelProvider from '../panel/PanelProvider.svelte';
    import PanelRooms from '../panel/rooms/PanelRooms.svelte';
    import ScreenRoomsSettings from '../panel/rooms/ScreenRoomsSettings.svelte';

    const panels = writable<PanelEntry[]>([
        {
            icon: 'ti ti-bolt',
            name: 'ルーム',
            componentPanel() {
                return {
                    component: PanelRooms,
                    props: {}
                };
            },
            componentSettings() {
                return { component: ScreenRoomsSettings, props: {} };
            }
        },
        {
            icon: 'ti ti-home',
            name: 'チャンネル',
            componentPanel() {
                return {
                    component: PanelChannels,
                    props: {}
                };
            },
            fit: true,
            componentSettings() {
                return { component: ScreenRoomsSettings, props: {} };
            }
        },
    ]);
</script>

<PanelProvider {panels} />
