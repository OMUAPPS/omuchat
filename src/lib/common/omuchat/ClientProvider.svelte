<script lang="ts">
    import { App, ChatExtensionType, OmuClient } from '@omuchat/client';
    import type { Connection } from '@omuchat/client/src/connection';
    import { onDestroy } from 'svelte';

    import { setClient } from './client';

    export let app: App;
    export let connection: Connection;

    const client = new OmuClient({
        app,
        connection,
    });
    setClient({
        client,
        chat: client.extensions.get(ChatExtensionType),
    });

    client.start();
    onDestroy(() => {
        client.stop();
    });
</script>

<slot />
