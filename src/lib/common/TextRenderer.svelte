<script lang="ts">
	import type { ImageComponent, TextComponent } from '@omuchat/client';

	export let components: Array<TextComponent | ImageComponent> = [];
</script>

{#each components as component}
	{#if component.type === 'text'}
		{component.value}
	{:else if component.type === 'image'}
		<img src={component.value} alt={component.id} />
	{/if}
{/each}
