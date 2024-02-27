<script lang="ts">
	export let href = '';
	export let filled = false;

	if (href?.length && !href.startsWith('http')) {
		href = `https://${href}`;
	}
</script>

{#if href}
	<a {href} target="_blank" class:filled>
		{href}
		<slot />
	</a>
{/if}

<style lang="scss">
	a {
		font-size: 12px;
		color: var(--color-1);

		&.filled {
			color: var(--color-bg-1);
			text-decoration: none;
			background: var(--color-1);
		}
	}
</style>
