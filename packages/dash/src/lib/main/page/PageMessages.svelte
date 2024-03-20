<script lang="ts">
    import type { models } from '@omuchatjs/chat';
    import { writable } from 'svelte/store';

    import { t } from '$lib/i18n/i18n-context.js';

    import PanelMessages from '../panel/messages/PanelMessages.svelte';
    import type { PanelEntry } from '../panel/panel.js';
    import PanelProvider from '../panel/PanelProvider.svelte';
    import PanelRooms from '../panel/rooms/PanelRooms.svelte';

    const panels = writable<PanelEntry[]>([
        {
            icon: 'ti ti-bolt',
            name: $t('panels.rooms.title'),
            component: PanelRooms,
            props: {},
        },
        {
            icon: 'ti ti-message',
            name: $t('panels.messages.title'),
            width: 300,
            fit: true,
            component: PanelMessages,
            props: {},
        },
        {
            icon: 'ti ti-message',
            name: $t('panels.gifts.title'),
            width: 400,
            component: PanelMessages,
            props: {
                filter: (_key: string, message: models.Message) =>
                    !!(message.gifts?.length || message.paid),
            },
        },
    ]);
</script>

<PanelProvider {panels} />
