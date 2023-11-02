<script>
	export let callback = () => {};
</script>

<button class="button" type="button" on:click={callback}>
	<slot />
</button>

<style lang="scss">
	.button {
		display: flex;
		justify-content: center;
		align-items: center;
		outline: none;
		border: none;
		display: flex;
		width: 40px;
		height: 40px;
		justify-content: center;
		align-items: center;
		color: var(--color-1);
		background: transparent;
		font-size: 16px;

		&:hover {
			background: var(--color-1);
			color: var(--color-bg-2);
		}
	}
</style>
