<script lang="ts">
    import { page } from '$app/stores';
    import { Client } from '@omuchatjs/chat';
    import { App } from '@omuchatjs/omu';
    import { setClient } from '@omuchatjs/ui';
    import { BROWSER } from 'esm-env';
    import { IDENTIFIER } from '../app.js';
    import { CaptionApp } from '../caption-app.js';
    import CaptionRenderer from '../CaptionRenderer.svelte';

    let assetId = BROWSER && $page.url.searchParams.get('assetId');
    const id = assetId || Date.now().toString();
    const client = setClient(
        new Client({
            app: new App(IDENTIFIER.join('asset', id), {
                version: '0.1.0',
            }),
        }),
    );
    let captionApp = new CaptionApp(client);

    if (BROWSER) {
        client.start();
    }
</script>

{#if id}
    <CaptionRenderer {captionApp} />
{:else}
    <p>id is not provided</p>
{/if}

<style>
    :global(body) {
        background: var(--color-bg-2);
    }
</style>
