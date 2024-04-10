<script lang="ts">
    import { page } from '$app/stores';
    import ReactionOverlay from './ReactionOverlay.svelte';

    let id = $page.url.searchParams.get('id');
</script>

<div class="debug">
    id: {id}
</div>
{#if id}
    <ReactionOverlay {id} />
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
</style>
