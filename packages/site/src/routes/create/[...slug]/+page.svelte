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
    }
</style>
