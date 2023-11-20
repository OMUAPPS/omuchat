<script lang="ts">
    import type { Provider } from '@omuchat/client';

    import { getClient } from '$lib/common/omuchat/client';
    import Screen from '$lib/common/screen/Screen.svelte';
    
const { chat } = getClient();
    let providers: Provider[] | null = null;
    let url: string = '';

    chat.providers!.on({
        onCacheUpdate(cache) {
            providers = [...cache.values()];
        },
    });
</script>

<Screen title="add_channel">
    <div class="container">
        {url}
        {#if providers && providers.length}
            {#each providers.values() as provider}
                {provider.name}
            {/each}
        {:else}
            プロバイダーが見つかりませんでした。
        {/if}
    </div>
</Screen>

<style lang="scss">
    .container {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
    }
</style>
