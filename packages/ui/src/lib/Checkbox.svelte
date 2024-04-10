<script lang="ts">
	export let value: boolean;
	export let disabled: boolean = false;

	function toggle() {
		value = !value;
	}
</script>

<label class="toggle">
	<input type="checkbox" bind:checked={value} {disabled} on:click={toggle} />
	{#if value}
		<i class="toggle-icon ti ti-check" />
	{/if}
</label>

<style lang="scss">
	.toggle {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px;
		cursor: pointer;
		user-select: none;

		input {
			width: 20px;
			height: 20px;
			appearance: none;
			background: var(--color-bg-2);
			border: none;
			border-radius: 5px;
			outline: 1px solid var(--color-1);

			&:checked {
				background: var(--color-1);
				outline: none;
			}
		}

		&:hover {
			input {
				outline: 2px solid var(--color-1);
			}
		}

		.toggle-icon {
			position: absolute;
			right: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 20px;
			height: 20px;
			color: var(--color-bg-2);
		}
	}
</style>
