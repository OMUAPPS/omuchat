<script lang="ts">
    import { screenContext } from './screen.js';

    const current = screenContext.current;
</script>

{#if $current}
    <svelte:component this={$current.component} {...$current.props} />
{/if}
