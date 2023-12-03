<script lang="ts">
    import { models } from "@omuchat/client";
    
    export let component: models.Content;
</script>

{#if component instanceof models.TextContent}
    {component.text || ''}
{:else if component instanceof models.ImageContent}
    <img src={component.url} alt={component.id} title={component.id} />
{/if}
{#if component.siblings}
    {#each component.siblings as sibling}
        <svelte:self component={sibling} />
    {/each}
{/if}
