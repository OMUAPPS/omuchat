<script lang="ts">
    import { writable } from 'svelte/store';

    import { t } from '$lib/i18n/i18n-context.js';

    import PanelChannels from '../panel/channels/PanelChannels.svelte';
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
            icon: 'ti ti-home',
            name: $t('panels.channels.title'),
            fit: true,
            component: PanelChannels,
            props: {},
        },
    ]);
</script>

<PanelProvider {panels} />
