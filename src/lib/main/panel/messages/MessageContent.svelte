<script lang="ts">
    import { models } from "@omuchatjs/chat";

    import LinkableText from "$lib/common/LinkableText.svelte";
    import Tooltip from "$lib/common/tooltip/Tooltip.svelte";
    
    export let component: models.Content;
</script>

{#if component instanceof models.TextContent}
    <LinkableText text={component.text || ''} />
{:else if component instanceof models.ImageContent}
    <span>
        <Tooltip>
            {component.name || component.id}
            <img src={component.url} alt={component.id} class="preview" />
        </Tooltip>
        <img src={component.url} alt={component.id} />
    </span>
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

    .preview {
        max-height: 64px;
        padding: 4px;
        vertical-align: middle;
        object-fit: contain;
    }
</style>