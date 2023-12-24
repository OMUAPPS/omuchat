<script lang="ts">
    import type { Provider } from "@omuchat/client/src/models";

    import { getClient } from "./client";

  import { classes } from "$lib/utils/class-helper";

    export let providerId: string;

    const { chat } = getClient();

    async function getProvider(): Promise<Provider | undefined> {
        const provider = await chat.providers.get(providerId);
        return provider;
    }
</script>

<div class="icon">
{#await getProvider() then provider}
    {#if provider}
    <img
    src={provider.image_url || `https://www.google.com/s2/favicons?domain=${provider.url}`}
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