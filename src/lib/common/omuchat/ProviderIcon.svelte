<script lang="ts">
    import type { Provider } from "@omuchat/client";

    import { getClient } from "./client";

    export let providerId: string;

    const { chat } = getClient();

    async function getProvider(): Promise<Provider> {
        const provider = await chat.providers!.get(providerId);
        if (!provider) throw new Error("Provider not found");
        return provider;
    }
</script>

{#await getProvider() then provider}
    <img
        src={provider.image_url || `https://www.google.com/s2/favicons?domain=${provider.url}`}
        alt="icon"
        class="provider-icon"
        width="32"
        height="32"
    />
{/await}
