<script>
	export let callback = () => {};
	export let outline = false;
	export let rounded = false;
	export let disabled = false;
</script>

<button class="button" type="button" on:click={callback} class:outline class:rounded {disabled}>
	<slot />
</button>

<style lang="scss">
	.button {
		display: flex;
		justify-content: center;
		align-items: center;
		outline: none;
		border: none;
		color: var(--color-1);
		background: transparent;
		min-width: 40px;
		min-height: 40px;
		max-height: 100%;
		padding-left: 10px;
		padding-right: 10px;
		font-size: 16px;

		&:hover {
			background: var(--color-1);
			color: var(--color-bg-2);
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	.outline {
		border: 1px solid var(--color-1);
		// box-shadow: 0 1px 0 0 var(--color-1);
	}

	.rounded {
		border-radius: 6px;
	}
</style>
