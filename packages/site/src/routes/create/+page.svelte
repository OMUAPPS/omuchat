<script lang="ts">
    import Page from '$lib/components/Page.svelte';
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<Page>
    <header slot="header">
        <h1>
            アプリを作る
            <i class="ti ti-pencil" />
        </h1>
        <small> OMUシステムを使ってアプリを作ってみる </small>
    </header>
</Page>

<style lang="scss">
    h1 {
        font-size: 2rem;
        font-weight: 600;
        width: fit-content;
        color: var(--color-1);
    }
</style>
