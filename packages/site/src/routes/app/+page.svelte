<script lang="ts">
    import { page } from '$app/stores';
    import AppEntry from './AppEntry.svelte';
    import { apps, loadApps } from './apps.js';

    loadApps($page.url.origin);
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
    <h1>
        <b>アプリを探す</b>
        <i class="ti ti-player-play" />
    </h1>
    <div class="apps">
        {#each apps as app, i (i)}
            <AppEntry {app} />
        {/each}
    </div>
</section>

<style lang="scss">
    h1 {
        margin: 4rem 0;
    }

    section {
        display: flex;
        flex: 0.6;
        flex-direction: column;
        align-items: start;
        justify-content: center;
        padding: 0 1rem;
    }

    .apps {
        display: grid;
        grid-template-rows: repeat(3, 1fr);
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 40px;
        width: 100%;
    }
</style>
