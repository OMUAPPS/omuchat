<script lang="ts">
    import type { Platform, VersionManifest } from '$lib/api/index.js';
    import { Api } from '$lib/api/index.js';
    import title from '$lib/images/title.svg';
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

<section>
    <h1>
        <span class="welcome">
            <img src={title} alt="title" />
            <p class="info">おむちゃっとは、配信者と視聴者をつなぐAPIです。</p>
        </span>
    </h1>

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
        <a href="/apps">
            アプリを探す
            <i class="ti ti-player-play" />
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
                    <a href={platform.url} class="download" on:click={() => (downloading = true)}>
                        {key}
                        <i class="ti ti-download" />
                    </a>
                </li>
            {/each}
        </ul>
        <code>pip install omuserver</code>
        <code>npm install omuserver</code>
    {/if}
</section>

<style lang="scss">
    section {
        container-type: inline-size;
        display: flex;
        flex: 0.6;
        flex-direction: column;
        align-items: start;
        justify-content: center;
        padding: 0 1rem;
    }

    h1 {
        width: 100%;
    }

    .info {
        padding: 0.5rem;
        margin-bottom: 1rem;
        font-size: 1rem;
        font-weight: 500;
        color: var(--color-1);
        background: var(--color-bg-2);
    }

    p {
        margin-top: 10rem;
        text-wrap: nowrap;

        a {
            display: inline-flex;
            gap: 0.2rem;
            align-items: center;
            padding: 0.6rem;
            margin-right: 1rem;
            margin-bottom: 1rem;
            font-size: 1.1rem;
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

    .welcome {
        position: relative;
        display: block;
        width: 100%;
        height: 0;
        padding: 0 0 calc(max(100% * 400 / 2048, 100px) + 0.5rem) 0;
        margin-top: 10rem;

        img {
            position: absolute;
            top: 0;
            display: block;
            height: 40%;
        }

        .info {
            position: absolute;
            bottom: 0;
            left: 0;
            font-weight: 700;
        }
    }

    @container (max-width: 480px) {
        section {
            padding: 0 0.5rem;
        }

        .welcome {
            margin-top: 5rem;
        }

        p {
            margin-top: 5rem;

            a {
                font-size: 0.8rem;
            }
        }

        .info {
            font-size: 0.8rem;
        }

        button {
            font-size: 0.8rem;
        }
    }
</style>
