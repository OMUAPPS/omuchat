<script lang="ts">
    import type { DocsData } from '$lib/server/docs/index.js';
    import { docs } from '../stores.js';
    import Markdown from '$lib/components/markdown/Markdown.svelte';

    export let data: { page: DocsData };
    $: $docs = data.page;
</script>

<Markdown source={$docs.content} />
