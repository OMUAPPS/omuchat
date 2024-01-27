<script lang="ts">
    import { writable } from 'svelte/store';

    import PanelApps from './PanelApps.svelte';

    import PanelMessages from '$lib/main/panel/messages/PanelMessages.svelte';
    import PanelMessagesSettings from '$lib/main/panel/messages/PanelMessagesSettings.svelte';
    import type { PanelEntry } from '$lib/main/panel/panel.js';
    import PanelProvider from '$lib/main/panel/PanelProvider.svelte';
    import PanelRooms from '$lib/main/panel/rooms/PanelRooms.svelte';
    import ScreenRoomsSettings from '$lib/main/panel/rooms/ScreenRoomsSettings.svelte';


    const panels = writable<PanelEntry[]>([
        {
            icon: 'ti ti-bolt',
            name: '接続中',
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
                    component: PanelMessagesSettings,
                    props: {}
                };
            }
        },
        {
            icon: 'ti ti-player-play',
            name: 'アプリ',
            componentPanel() {
                return {
                    component: PanelApps,
                    props: {}
                };
            },
            componentSettings() {
                return {
                    component: PanelMessagesSettings,
                    props: {}
                };
            }
        },
    ]);
</script>

<PanelProvider {panels} />
