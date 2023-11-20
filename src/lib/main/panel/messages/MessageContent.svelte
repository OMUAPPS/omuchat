<script lang="ts">
    import { ImageContent, TextContent, type Content } from "@omuchat/client";

    export let component: Content;
</script>

{#if component instanceof TextContent}
    {component.text || ''}
{:else if component instanceof ImageContent}
    <img src={component.url} alt={component.id} title={component.id} />
{/if}
{#if component.siblings}
    {#each component.siblings as sibling}
        <svelte:self component={sibling} />
    {/each}
{/if}
