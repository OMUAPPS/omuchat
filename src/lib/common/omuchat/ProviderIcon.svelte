<script lang="ts">
    import type { Provider } from "@omuchatjs/chat/models/index.js";

    import { getClient } from "./client.js";

    import { classes } from "$lib/utils/class-helper.js";

    export let providerId: string;

    const { chat, client } = getClient();

    async function getProvider(): Promise<Provider | undefined> {
        const provider = await chat.providers.get(providerId);
        return provider;
    }
</script>

<div class="icon">
{#await getProvider() then provider}
    {#if provider}
    <img
    src={client.proxy(provider.image_url || `https://${provider.url}/favicon.ico`)}
    alt="icon"
    class={classes("provider-icon", provider.image_url && "custom")}
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