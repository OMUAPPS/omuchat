<script lang="ts">
    import type { models } from '@omuchat/client';
    import { writable } from 'svelte/store';

    import PanelMessages from '../panel/messages/PanelMessages.svelte';
    import PanelMessagedSettings from '../panel/messages/PanelMessagesSettings.svelte';
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
                    component: PanelMessagedSettings,
                    props: {}
                };
            }
        },
        {
            icon: 'ti ti-message',
            name: 'ギフト／投げ銭',
            width: 400,
            componentPanel() {
                return {
                    component: PanelMessages,
                    props: {
                        filter: (message: models.Message) => !!(message.gift || message.paid)
                    }
                };
            },
            componentSettings() {
                return {
                    component: PanelMessagedSettings,
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
