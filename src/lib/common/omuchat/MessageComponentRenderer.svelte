<script lang="ts">
	import type { MessageComponentType } from '@/omuchat';

	export let component: MessageComponentType;
</script>

{#if component.type === 'text'}
	{component.value || ''}
{:else if component.type === 'image'}
	<img src={component.value} alt={component.id} />
{/if}
{#if component.siblings}
	{#each component.siblings as sibling}
		<svelte:self component={sibling} />
	{/each}
{/if}
