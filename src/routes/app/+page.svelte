<script lang="ts">
    import { apps } from "$lib/apps/apps";
    import { getParams } from "$lib/utils/location";
    import '../styles.scss';

    const id = getParams<{id?: string}>().id;
    const app = id && apps.get(id);
</script>

{#if !app}
    Invalid app id
{:else}
    <svelte:component this={app.component} />
{/if}