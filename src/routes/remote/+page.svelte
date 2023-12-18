<script lang="ts">
    import { App } from '@omuchat/omu.js';

    import ClientProvider from '$lib/common/omuchat/ClientProvider.svelte';
    import PanelMessages from '$lib/main/panel/messages/PanelMessages.svelte';
    import { getBrowser, getOS } from '$lib/utils/device-helper';
    
    let id = window.sessionStorage.getItem('remote-client-id')
    if (!id) {
        id = Math.random().toString(36).substr(2, 4);
        window.sessionStorage.setItem('remote-client-id', id);
    }

    const app = new App({
        name: `remote-client-${getOS()}-${getBrowser()}-${id}`,
        version: "0.1.0",
        group: "omu",
    });
</script>

<main>
    <ClientProvider {app}>
        <PanelMessages />
    </ClientProvider>
</main>

<style>
    main {
        height: 100vh;
        background: var(--color-bg-2);
    }
</style>