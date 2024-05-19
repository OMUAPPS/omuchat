<script lang="ts">
    import { page } from '$app/stores';
    import { Theme } from '@omujs/ui';
    import Header from './Header.svelte';
    import './styles.css';

    const isInApp = /\/app\/./gm.test($page.url.pathname);
</script>

<Theme />
{#if isInApp}
    <div class="app">
        <slot />
    </div>
{:else}
    <div class="app">
        <Header />

        <main>
            <slot />
        </main>
    </div>
{/if}

<style>
    .app {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    main {
        box-sizing: border-box;
        display: flex;
        flex: 1;
        flex-direction: column;
        width: 100%;
        max-width: 64rem;
        padding: 1rem;
        margin: 0 auto;
    }
</style>
