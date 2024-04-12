<script lang="ts" generics="T">
	export let options: {
		[key: string]: {
			value: T;
			label: string;
		};
	};
	export let defaultValue: string | undefined = undefined;
	export let handleChange: (key: string, value: T) => void;

	function onChange() {
		if (!defaultValue) {
			return;
		}
		if (options[defaultValue] === undefined) {
			throw new Error(`Invalid default value: ${defaultValue}`);
		}
		handleChange(defaultValue, options[defaultValue].value);
	}
</script>

<div class="combo-box">
	<select bind:value={defaultValue} on:change={() => onChange()}>
		{#each Object.entries(options) as [key, option]}
			<option value={key}>{option.label}</option>
		{/each}
	</select>
</div>

<style lang="scss">
	select {
		width: 100%;
		padding: 5px 5px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-1);
		background: var(--color-bg-2);
		border: none;
		outline: none;
		cursor: pointer;
	}
</style>
