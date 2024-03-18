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
        object-fit: contain;
        vertical-align: middle;
    }

    code {
        white-space: pre-wrap;
        word-break: break-word;
        white-space: normal;
        background-color: var(--color-bg-1);
        color: var(--color-1);
        font-weight: bold;
    }

    .preview {
        max-height: 64px;
        padding: 4px;
        vertical-align: middle;
        object-fit: contain;
    }
</style>
