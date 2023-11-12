<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let label: string;
	export let value: Writable<string>;
	export let options: string[];
	export let disabled: boolean = false;
</script>

<div class="combo">
	<span class="combo-label">{label}</span>
	<select bind:value={$value} {disabled}>
		{#each options as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
</div>

<style lang="scss">
	.combo {
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
	}
</style>
