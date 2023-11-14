<script lang="ts">
    import { writable } from 'svelte/store';

    import PanelMessages from '../panel/messages/PanelMessages.svelte';
    import type { PanelEntry } from '../panel/panel';
    import PanelProvider from '../panel/PanelProvider.svelte';
    import PanelRooms from '../panel/rooms/PanelRooms.svelte';
    import ScreenRoomsSettings from '../panel/rooms/ScreenRoomsSettings.svelte';

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
                return { component: ScreenRoomsSettings, props: {} };
            }
        }
    ]);
</script>

<PanelProvider {panels} />
