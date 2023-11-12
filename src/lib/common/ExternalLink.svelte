<script>
	export let href = '';
	export let filled = false;
</script>

<a {href} target="_blank" class:filled>
	{href}
	<slot />
</a>

<style>
	a {
		color: var(--color-1);
		font-size: 12px;

		&.filled {
			text-decoration: none;
			background-color: var(--color-1);
			color: var(--color-bg-1);
		}
	}
</style>
