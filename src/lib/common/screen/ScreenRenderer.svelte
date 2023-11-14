<script lang="ts">
    import { popupContext } from './screen';
    const current = popupContext.current;
</script>

{#if $current}
    <svelte:component this={$current.component} {...$current.props} />
{/if}
