<script lang="ts">
    import type { Provider } from '@omuchatjs/chat/models/index.js';

    import { classes } from '$lib/utils/class-helper.js';
    import type { Identifier } from '@omuchatjs/omu/identifier.js';
    import { chat, omu } from './client.js';

    export let providerId: Identifier;

    async function getProvider(): Promise<Provider | undefined> {
        const provider = await chat.providers.get(providerId.key());
        return provider;
    }
</script>

<div class="icon">
    {#await getProvider() then provider}
        {#if provider}
            <img
                src={omu.assets.proxy(provider.imageUrl || `https://${provider.url}/favicon.ico`)}
                alt="icon"
                class={classes('provider-icon', provider.imageUrl && 'custom')}
                width="16"
                height="16"
            />
        {/if}
    {/await}
</div>

<style>
    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
    }

    .custom {
        width: 32px;
        height: 32px;
    }
</style>
