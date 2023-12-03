<script lang="ts">
    import { Client } from '@omuchat/client';
    import { ServerExtensionType, type App } from '@omuchat/omu.js';
    import { onDestroy } from 'svelte';

    import { setClient } from './client';
    import { DashboardExtensionType } from './dashboard-ext';

    export let app: App;

    const client = new Client({
        app,
    });
    const omu = client.omu;
    omu.extensions.register(DashboardExtensionType);
    setClient({
        client: client.omu,
        chat: client.chat,
        server: omu.extensions.get(ServerExtensionType),
        dashboard: omu.extensions.get(DashboardExtensionType),
    });

    client.run();
    onDestroy(() => {
    });
</script>

<slot />
