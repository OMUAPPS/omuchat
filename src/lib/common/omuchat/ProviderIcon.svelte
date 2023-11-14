<script lang="ts">
    import { getClient } from './omuchat';

    export let providerId: string;

    const client = getClient();
</script>

{#await client.providers.get(providerId) then provider}
    <img
        src={provider.image_url || `https://www.google.com/s2/favicons?domain=${provider.site_url}`}
        alt="icon"
        class="provider-icon"
        width="32"
        height="32"
    />
{/await}
