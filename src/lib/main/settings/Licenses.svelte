<script lang="ts">
    import SvelteMarkdown from 'svelte-markdown'
    import ExternalLink from '$lib/common/input/ExternalLink.svelte';
    import { LICENSES } from '$lib/license/license.js';

    let selected: string | undefined;
</script>

<div class="container">
    {#each LICENSES as license (license.name)}
        <button
            class="license"
            on:click={() => (selected = license.name === selected ? undefined : license.name)}
        >
            <div class="body">
                <h3>
                    {license.name}
                </h3>
                <ExternalLink href={license.url} />
                {license.license}
                {#if selected === license.name}
                    <div class="content">
                        <SvelteMarkdown source={license.licenseText}/>
                    </div>
                {/if}
            </div>
        </button>
    {/each}
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        height: 100%;
        padding-top: 40px;
        padding-left: 80px;
        overflow: auto;
    }

    .license {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        padding: 20px 0;
        text-align: left;
        cursor: pointer;
        background: none;
        border: none;

        .content {
            margin-top: 10px;
            font-size: 10px;
            white-space: pre-wrap;
        }

        .body {
            padding-left: 10px;
        }

        &:hover {
            .body {
                padding-left: 8px;
                border-left: 2px solid var(--color-1);
            }
        }
    }

    h3 {
        font-size: 20px;
        color: var(--color-1);
    }
</style>
