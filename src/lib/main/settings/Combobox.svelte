<script lang="ts">
	import { t } from '$lib/i18n/i18n-context';
	import type { Writable } from 'svelte/store';

	export let label: string;
	export let value: Writable<string>;
	export let options: string[];
	export let disabled: boolean = false;
</script>

<div class="combo">
	<span class="combo-label">{$t(label)}</span>
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
	}
</style>
