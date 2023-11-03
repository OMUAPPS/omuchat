<script lang="ts">
	import { createPopupContext } from './popup';
	const component = createPopupContext().current;
</script>

{#if $component}
	<svelte:component this={$component.component} {...$component.props} />
{/if}

<slot />
