<script lang="ts">
    import { writable } from 'svelte/store';

    import PanelProvider from '$lib/main/panel/PanelProvider.svelte';
    import PanelMessages from '$lib/main/panel/messages/PanelMessages.svelte';
    import type { PanelEntry } from '$lib/main/panel/panel.js';
    import PanelRooms from '$lib/main/panel/rooms/PanelRooms.svelte';
    import PanelApps from './PanelApps.svelte';
    import { t } from '$lib/i18n/i18n-context.js';

    const panels = writable<PanelEntry[]>([
        {
            icon: 'ti ti-bolt',
            name: $t('panels.rooms.title'),
            component: PanelRooms,
            props: {},
        },
        {
            icon: 'ti ti-message-circle',
            name: $t('panels.messages.title'),
            width: 300,
            fit: true,
            component: PanelMessages,
            props: {},
        },
        {
            icon: 'ti ti-package',
            name: $t('panels.apps.title'),
            component: PanelApps,
            props: {},
        },
    ]);
</script>

<PanelProvider {panels} />
