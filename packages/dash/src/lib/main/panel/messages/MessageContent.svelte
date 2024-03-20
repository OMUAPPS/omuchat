<script lang="ts">
    import LinkableText from '$lib/common/LinkableText.svelte';
    import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
    import { content } from '@omuchatjs/chat/models/index.js';

    export let component: content.Component;
</script>

{#if component instanceof content.Text}
    <LinkableText text={component.text || ''} />
{:else if component instanceof content.Image}
    <span>
        <Tooltip>
            {component.name || component.id}
            <img src={component.url} alt={component.id} class="preview" />
        </Tooltip>
        <img src={component.url} alt={component.id} />
    </span>
{:else if component instanceof content.Link}
    <a href={component.url} target="_blank" rel="noopener noreferrer">
        {#each component.children || [] as sibling}
            <svelte:self component={sibling} />
        {/each}
    </a>
{:else if component instanceof content.System}
    <code>
        {#each component.children || [] as sibling}
            <svelte:self component={sibling} />
        {/each}
    </code>
{:else if component.isParent()}
    {#each component.children as sibling}
        <svelte:self component={sibling} />
    {/each}
{/if}

<style>
    img {
        max-height: 30px;
        vertical-align: middle;
        object-fit: contain;
    }

    code {
        display: flex;
        flex-direction: row wrap;
        gap: 5px;
        align-items: center;
        padding: 5px 10px;
        margin: 5px 0;
        font-weight: bold;
        color: var(--color-1);
        background-color: var(--color-bg-1);
    }

    .preview {
        max-height: 64px;
        padding: 4px;
        vertical-align: middle;
        object-fit: contain;
    }
</style>
