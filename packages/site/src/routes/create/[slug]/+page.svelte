<script lang="ts">
    import type { DocsData } from '$lib/server/docs/index.js';
    import SvelteMarkdown from 'svelte-markdown';
    import { docs } from '../stores.js';

    export let data: { page: DocsData };
    $: $docs = data.page;
</script>

<div class="container">
    <SvelteMarkdown source={$docs.content} />
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        align-items: start;
        padding: 1rem 0;
        max-width: 800px;
        text-wrap: wrap;
        white-space: pre-wrap;

        :global(h1) {
            font-size: 2rem;
            margin: 1rem 0;
        }

        :global(h2) {
            font-size: 1.5rem;
            margin: 1rem 0;
        }

        :global(h3) {
            font-size: 1.25rem;
            margin: 1rem 0;
        }
    }
</style>
