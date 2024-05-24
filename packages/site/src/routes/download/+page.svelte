<script lang="ts">
    import Page from '$lib/components/Page.svelte';
    import type { Platform, VersionManifest } from '$lib/api/index.js';
    import { Api } from '$lib/api/index.js';
    import { onMount } from 'svelte';

    let versions: VersionManifest | undefined;
    let version: Platform | undefined;
    let downloading = false;
    let showExtra = false;

    onMount(async () => {
        versions = await Api.getVersions();
        const platform = Api.getPlatform();
        if (versions.platforms[platform] === undefined) {
            console.error(`Platform ${platform} is not supported.`);
            return;
        }
        version = versions.platforms[platform];
    });

    $: if (downloading) {
        setTimeout(() => {
            downloading = false;
        }, 1000);
    }
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<Page>
    <header slot="header">
        <h1>
            ダウンロード
            <i class="ti ti-search" />
        </h1>
        <small> OMUAPPSをダウンロードして使ってみる </small>
    </header>
    <main slot="content">
        <p>
            {#if version}
                <a href={version?.url} class="download" on:click={() => (downloading = true)}>
                    {#if downloading}
                        ダウンロード中...
                    {:else}
                        ダウンロード
                    {/if}
                    <i class="ti ti-download" />
                </a>
            {/if}
            <a href="/app">
                アプリを探す
                <i class="ti ti-external-link" />
            </a>
        </p>
        <button on:click={() => (showExtra = !showExtra)}>
            <small>
                別のインストール方法をお探しですか？
                <i class="ti ti-chevron-{showExtra ? 'up' : 'down'}" />
            </small>
        </button>
        {#if showExtra}
            <ul>
                {#each Object.entries(versions?.platforms ?? {}) as [key, platform] (key)}
                    <li>
                        <a
                            href={platform.url}
                            class="download"
                            on:click={() => (downloading = true)}
                        >
                            {key}
                            <i class="ti ti-download" />
                        </a>
                    </li>
                {/each}
            </ul>
            <code>pip install omuserver</code>
            <code>npm install omuserver</code>
        {/if}
    </main>
</Page>

<style lang="scss">
    h1 {
        font-size: 2rem;
        font-weight: 600;
        width: fit-content;
        color: var(--color-1);
    }

    p {
        text-wrap: nowrap;

        a {
            display: inline-flex;
            gap: 0.2rem;
            align-items: center;
            padding: 0.6rem;
            margin-right: 1rem;
            margin-bottom: 1rem;
            font-size: 1rem;
            background: var(--color-bg-2);

            &:hover {
                background: var(--color-bg-3);
            }
        }

        .download {
            color: var(--color-bg-2);
            background: var(--color-1);

            &:hover {
                color: var(--color-1);
                text-decoration: none;
                background: var(--color-bg-2);
                outline: 1px solid var(--color-1);
            }
        }
    }

    button {
        display: flex;
        font-size: 1rem;
        color: var(--color-1);
        cursor: pointer;
        background: none;
        border: none;
        outline: none;
    }

    code {
        padding: 0.1rem;
        margin-bottom: 0.2rem;
        font-size: 0.9rem;
        color: var(--color-1);
        background: var(--color-bg-2);
    }

    @container (max-width: 480px) {
        section {
            padding: 0 0.5rem;
        }

        header {
            margin-top: 5rem;
        }

        p {
            margin-top: 5rem;

            a {
                font-size: 0.8rem;
            }
        }

        button {
            font-size: 0.8rem;
        }
    }
</style>
