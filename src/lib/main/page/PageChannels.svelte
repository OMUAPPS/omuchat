<script lang="ts">
    import { writable } from 'svelte/store';

    import PanelChannels from '../panel/channels/PanelChannels.svelte';
    import type { PanelEntry } from '../panel/panel';
    import PanelProvider from '../panel/PanelProvider.svelte';
    import PanelRooms from '../panel/rooms/PanelRooms.svelte';
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
            fit: true,
            componentSettings() {
                return { component: PopupRoomsSettings, props: {} };
            }
        },
        {
            icon: 'ti ti-home',
            name: 'ルーム',
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
