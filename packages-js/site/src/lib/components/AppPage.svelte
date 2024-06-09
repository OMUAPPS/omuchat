<script lang="ts">
    import { page } from '$app/stores';
    import { client } from '@omujs/ui';
    import Spinner from '../../routes/app/archive/components/Spinner.svelte';

    const isInApp = /\/app\/./gm.test($page.url.pathname);
    let loading = false;

    if (isInApp) {
        loading = true;
        client.subscribe((omu) => {
            if (!omu) return;
            omu.onReady(() => {
                loading = false;
            });
        });
    }
</script>

<slot name="header" />
<slot />
{#if loading}
    <div class="loading">
        <Spinner />
    </div>
{/if}

<style lang="scss">
    .loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: color-mix(in srgb, var(--color-bg-1) 95%, transparent 0%);
        color: var(--color-1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
    }
</style>
