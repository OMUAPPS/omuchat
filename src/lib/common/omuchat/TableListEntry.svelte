<script lang="ts">
	import { onMount } from 'svelte';

	export let selected: boolean;
	export let key: string;
	export let selectItem: (key: string | undefined) => void;

	let element: HTMLElement;

	onMount(() => {
		if (selected) {
			element.focus();
		}
	});
</script>

<div
	bind:this={element}
	tabindex="-1"
	on:mouseenter={() => selectItem(key)}
	on:mouseleave={() => selectItem(undefined)}
	role="listitem"
>
	<slot />
</div>
