<script lang="ts">
    import { App, Client } from '@omuchat/client';
    import { ServerExtensionType } from '@omuchat/omu.js/extension/server/server-extension.js';

    import { setClient } from './client.js';
    import { DashboardExtensionType } from './dashboard-ext.js';

    import { invoke } from '$lib/utils/tauri.js';

    export let app: App;

    const address = {
        host: window.location.hostname,
        port: 26423,
        secure: false
    };

    const token = {
        async get() {
            const token = await invoke('get_token') ?? window.localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            return token;
        },
        async set(token: string) {
            window.localStorage.setItem('token', token);
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
</script>

<slot />
