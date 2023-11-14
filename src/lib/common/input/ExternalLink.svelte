<script>
	export let href = '';
	export let filled = false;
</script>

<a {href} target="_blank" class:filled>
	{href}
	<slot />
</a>

<style lang="scss">
	a {
		font-size: 12px;
		color: var(--color-1);

		&.filled {
			color: var(--color-bg-1);
			text-decoration: none;
			background-color: var(--color-1);
		}
	}
</style>
