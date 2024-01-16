<script lang="ts">
    import { App, Client } from '@omuchatjs/chat';
    import type { TokenProvider } from '@omuchatjs/omu/client/token.js';
    import { ServerExtensionType } from '@omuchatjs/omu/extension/server/server-extension.js';

    import { setClient } from './client.js';
    import { DashboardExtensionType } from './dashboard-ext.js';

    import { invoke, isOnTauri } from '$lib/utils/tauri.js';

    export let app: App;
    export let connect = true;

    const address = {
        host: window.location.hostname,
        port: 26423,
        secure: false
    };

    const tokenKey = `omu-chat-token-${app.key()}`;
    const token: TokenProvider = {
        async get() {
            let token = null;
            if (isOnTauri) {
                token = await invoke('get_token');
            }
            if (!token) {
                token = window.localStorage.getItem(tokenKey);
            }
            return token;
        },
        async set(_: App, token: string) {
            window.localStorage.setItem(tokenKey, token);
        }
    }

    const client = new Client({
        app,
        address,
        token
    });
    const omu = client.omu;
    const dashboard = omu.extensions.register(DashboardExtensionType);
    setClient({
        client: client.omu,
        chat: client.chat,
        server: omu.extensions.get(ServerExtensionType),
        dashboard
    });

    if (connect) {
        client.run();
    }
</script>

<slot />
