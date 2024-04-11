<script lang="ts">
    import { page } from '$app/stores';
    import { Client } from '@omuchatjs/chat';
    import { App } from '@omuchatjs/omu';
    import { setClient } from '@omuchatjs/ui';
    import { BROWSER } from 'esm-env';
    import { IDENTIFIER } from '../app.js';
    import ReactionOverlay from '../components/ReactionRenderer.svelte';

    let id = $page.url.searchParams.get('id');

    const assetId = id || Date.now().toString();
    const app = new App(IDENTIFIER.join('asset', assetId), {
        version: '0.1.0',
    });
    const client = new Client({
        app,
    });
    setClient(client);

    if (BROWSER) {
        client.start();
    }
</script>

<div class="debug">
    id: {id}
</div>
{#if id}
    <ReactionOverlay {client} />
{:else}
    <p>id is not provided</p>
{/if}

<style>
    .debug {
        position: fixed;
        top: 0;
        right: 0;
        padding: 1rem;
        z-index: 1000;
    }

    :global(body) {
        background: transparent;
    }
</style>
