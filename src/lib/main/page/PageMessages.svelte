<script lang="ts">
    import type { models } from '@omuchatjs/chat';
    import { writable } from 'svelte/store';

    import PanelMessages from '../panel/messages/PanelMessages.svelte';
    import type { PanelEntry } from '../panel/panel.js';
    import PanelProvider from '../panel/PanelProvider.svelte';
    import PanelRooms from '../panel/rooms/PanelRooms.svelte';

    const panels = writable<PanelEntry[]>([
        {
            icon: 'ti ti-bolt',
            name: '接続中',
            panel: () => ({ component: PanelRooms, props: {} }),
        },
        {
            icon: 'ti ti-message',
            name: 'コメント／メッセージ',
            width: 300,
            fit: true,
            panel: () => ({ component: PanelMessages, props: {} }),
        },
        {
            icon: 'ti ti-message',
            name: 'ギフト／投げ銭',
            width: 400,
            panel: () => ({
                component: PanelMessages,
                props: {
                    filter: (_key: string, message: models.Message) =>
                        !!(message.gifts?.length || message.paid),
                },
            }),
        },
    ]);
</script>

<PanelProvider {panels} />
