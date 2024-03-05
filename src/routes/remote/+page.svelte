<script lang="ts">
    import { App } from '@omuchatjs/omu';

    import ClientProvider from '$lib/common/omuchat/ClientProvider.svelte';
    import PanelMessages from '$lib/main/panel/messages/PanelMessages.svelte';
    import { getTabId } from '$lib/utils/browser-helper.js';
    import { getBrowser, getOS } from '$lib/utils/device-helper.js';

    const app = new App({
        name: `remote-client-${getOS()}-${getBrowser()}-${getTabId()}`,
        version: '0.1.0',
        group: 'omu.chat',
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
