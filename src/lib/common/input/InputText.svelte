<script lang="ts">
	export let value: string = '';
	export let placeholder: string = '';
	export let disabled: boolean = false;
	export let readonly: boolean = false;
</script>

<input class="input" type="text" {placeholder} bind:value {disabled} {readonly} />

<style lang="scss">
	.input {
		width: 100%;
		height: 40px;
		padding: 0 10px;
		margin: 10px 0;
		background: var(--color-bg-1);
		border: 1px solid var(--color-1);
		border-radius: 5px;

		&:focus {
			background: var(--color-bg-1);
		}

		&:hover {
			outline: 1px solid var(--color-1);
		}

		&:disabled {
			color: var(--color-2);
			background: var(--color-bg-2);
		}

		&:read-only {
			color: var(--color-2);
			background: var(--color-bg-2);
		}

		&::placeholder {
			color: var(--color-1);
		}
	}
</style>
