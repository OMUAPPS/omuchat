<script lang="ts">
    import { Client } from '@omuchat/client';
    import { ServerExtensionType, type App } from '@omuchat/omu.js';
    import { onDestroy } from 'svelte';

    import { setClient } from './client';
    import { DashboardExtensionType } from './dashboard-ext';

    export let app: App;

    const address = {
        host: window.location.hostname,
        port: 26423,
        secure: false,
    }
    const client = new Client({
        app,
        address,
    });
    const omu = client.omu;
    const dashboard = omu.extensions.register(DashboardExtensionType);
    setClient({
        client: client.omu,
        chat: client.chat,
        server: omu.extensions.get(ServerExtensionType),
        dashboard,
    });

    client.run();
    onDestroy(() => {
    });
</script>

<slot />
