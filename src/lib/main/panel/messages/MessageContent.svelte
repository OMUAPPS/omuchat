<script lang="ts">
    import { models } from "@omuchat/client";

    import LinkableText from "$lib/common/LinkableText.svelte";
    
export let component: models.Content;
</script>

{#if component instanceof models.TextContent}
    <LinkableText text={component.text || ''} />
{:else if component instanceof models.ImageContent}
    <img src={component.url} alt={component.id} title={component.id} />
{/if}
{#if component.siblings}
    {#each component.siblings as sibling}
        <svelte:self component={sibling} />
    {/each}
{/if}

<style>
    img {
        max-height: 30px;
        object-fit: contain;
        vertical-align: middle;
    }
</style>