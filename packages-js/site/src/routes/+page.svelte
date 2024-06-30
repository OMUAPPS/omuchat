<script lang="ts">
    import Page from '$lib/components/Page.svelte';
    import title from '$lib/images/title.svg';
</script>

<svelte:head>
    <title>OMUAPPS</title>
    <meta name="description" content="配信者と視聴者をつなぐAPI" />
</svelte:head>

<Page noBackground>
    <header slot="header">
        <img src={title} alt="title" />
        <p class="info">OMUAPPSは、配信者と視聴者をつなぐAPIです。</p>
    </header>
</Page>

<style lang="scss">
    header {
        position: relative;
        display: block;
        width: 100%;
        padding: 0 0 calc(max(100% * 400 / 2048, 100px) + 0.5rem) 0;

        img {
            position: absolute;
            bottom: 5rem;
            display: block;
            height: 30%;
        }

        .info {
            position: absolute;
            bottom: 0;
            left: 0;
            font-weight: 700;
        }
    }

    @container (max-width: 480px) {
        header {
            margin-top: 5rem;
        }

        p {
            margin-top: 5rem;

            a {
                font-size: 0.8rem;
            }
        }

        .info {
            font-size: 0.6rem;
        }

        button {
            font-size: 0.8rem;
        }
    }

    .info {
        padding: 0.5rem;
        margin-bottom: 1rem;
        font-size: 1rem;
        font-weight: 500;
        color: var(--color-1);
        background: var(--color-bg-2);
    }
</style>
