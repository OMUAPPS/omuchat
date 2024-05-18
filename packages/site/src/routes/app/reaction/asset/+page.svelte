<script lang="ts">
    import { page } from '$app/stores';
    import { App, Omu } from '@omuchatjs/omu';
    import { setClient } from '@omuchatjs/ui';
    import { BROWSER } from 'esm-env';
    import { IDENTIFIER } from '../app.js';
    import ReactionOverlay from '../components/ReactionRenderer.svelte';
    import { ReactionApp } from '../reaction.js';

    let assetId = BROWSER && $page.url.searchParams.get('assetId');
    const id = assetId || Date.now().toString();
    const app = new App(IDENTIFIER.join('asset', id), {
        version: '0.1.0',
    });
    const omu = new Omu(app);
    setClient(omu);
    omu.permissions.require('cc.omuchat:chatprovider/youtube/reaction');
    let reactionApp = new ReactionApp(omu);

    if (BROWSER) {
        omu.start();
    }
</script>

{#if id}
    <ReactionOverlay {omu} {reactionApp} />
{:else}
    <p>id is not provided</p>
{/if}

<style>
    :global(body) {
        background: var(--color-bg-2);
    }
</style>
