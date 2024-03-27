<script>
    import { page } from '$app/stores';
    import ThemeProvider from '$lib/theme/ThemeProvider.svelte';
    import Header from './Header.svelte';
    import './styles.css';

    const appMode = /\/app\/./gm.test($page.url.pathname);
</script>

{#if appMode}
    <div class="app">
        <slot />
        <ThemeProvider />
    </div>
{:else}
    <div class="app">
        <Header />

        <main>
            <slot />
        </main>

        <footer>
            <p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
        </footer>
        <ThemeProvider />
    </div>
{/if}

<style>
    .app {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: var(--color-bg-1);
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

    footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 12px;
    }

    footer a {
        font-weight: bold;
    }

    @media (width >= 480px) {
        footer {
            padding: 12px 0;
        }
    }
</style>
