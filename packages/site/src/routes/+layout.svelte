<script lang="ts">
    import { page } from '$app/stores';
    import { Theme } from '@omuchatjs/ui';
    import Header from './Header.svelte';
    import './styles.css';

    const isInApp = /\/app\/./gm.test($page.url.pathname);
</script>

{#if isInApp}
    <div class="app">
        <slot />
        <Theme />
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
        <Theme />
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
