<script lang="ts">
    import { App, ChatExtensionType, OmuClient, ServerExtensionType } from '@omuchat/client';
    import type { Connection } from '@omuchat/client/src/connection';
    import { onDestroy } from 'svelte';

    import { setClient } from './client';
    import { DashboardExtensionType } from './dashboard-ext';

    export let app: App;
    export let connection: Connection;

    const client = new OmuClient({
        app,
        connection,
    });
    client.extensions.register(DashboardExtensionType);
    setClient({
        client,
        chat: client.extensions.get(ChatExtensionType),
        server: client.extensions.get(ServerExtensionType),
        dashboard: client.extensions.get(DashboardExtensionType),
    });

    client.start();
    onDestroy(() => {
        client.stop();
    });
</script>

<slot />
