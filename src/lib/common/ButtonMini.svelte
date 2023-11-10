<script>
	export let callback = () => {};
	export let outline = false;
	export let disabled = false;
</script>

<button class="button" type="button" on:click={callback} class:outline {disabled}>
	<slot />
</button>

<style lang="scss">
	.button {
		display: flex;
		justify-content: center;
		align-items: center;
		outline: none;
		border: none;
		background: transparent;
		min-width: 30px;
		padding-left: 6px;
		padding-right: 6px;
		min-height: 30px;
		border-radius: 5px;
		font-size: 16px;
		border-radius: 6px;

		&:hover {
			background: var(--color-1);
			outline: 2px solid #fff;
			color: var(--color-bg-2);
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	.outline {
		border: 1px solid var(--color-1);
	}
</style>
