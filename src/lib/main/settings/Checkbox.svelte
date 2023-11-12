<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let label: string;
	export let value: Writable<boolean>;
	export let disabled: boolean = false;

	function toggle() {
		$value = !$value;
	}
</script>

<label class="toggle">
	<span class="toggle-label">{label}</span>
	<input type="checkbox" bind:checked={$value} {disabled} on:click={toggle} />
	{#if $value}
		<i class="toggle-icon ti ti-check" />
	{/if}
</label>

<style lang="scss">
	.toggle {
		position: relative;
		width: 100%;
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		user-select: none;
		input {
			border: none;
			appearance: none;
			width: 20px;
			height: 20px;
			border-radius: 25%;
			background: var(--color-bg-2);
			outline: 1px solid var(--color-1);
			&:checked {
				background: var(--color-1);
				outline: none;
			}
		}

		.toggle-icon {
			position: absolute;
			justify-content: center;
			width: 20px;
			height: 20px;
			right: 10px;
			display: flex;
			align-items: center;
			color: var(--color-bg-2);
		}
	}
</style>
