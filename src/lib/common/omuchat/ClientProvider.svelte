<script lang="ts">
    import type { Address } from '@omuchatjs/omu/connection/address.js';

    import { App, Client } from '@omuchatjs/chat';

    import { setClient } from './client.js';

    import { invoke, isOnTauri } from '$lib/utils/tauri.js';
    import { BrowserTokenProvider } from '@omuchatjs/chat/client.js';
    import { Dashboard } from './dashboard.js';

    export let app: App;
    export let connect = true;

    const address = {
        host: window.location.hostname,
        port: 26423,
        secure: false,
    };

    class TokenProvider extends BrowserTokenProvider {
        async get(serverAddress: Address, app: App): Promise<string | null> {
            if (isOnTauri) {
                return await invoke('get_token');
            }
            return super.get(serverAddress, app);
        }

        async set(serverAddress: Address, app: App, token: string): Promise<void> {
            return super.set(serverAddress, app, token);
        }
    }

    const client = new Client({
        app,
        address,
        token: new TokenProvider('omu-token'),
    });
    setClient({
        chat: client,
        client: client.omu,
        dashboard: new Dashboard(client),
    });

    if (connect) {
        client.run();
    }
</script>

<slot />
