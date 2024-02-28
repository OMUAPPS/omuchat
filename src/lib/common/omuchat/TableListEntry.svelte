<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	export let selected: boolean;
	export let key: string;
	export let selectItem: (key: string | undefined) => void;
	export let transition: boolean = false;

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
	in:slide={{ duration: transition ? 100 : 0, easing: (t) => 1 - Math.pow(1 - t, 2) }}
	role="listitem"
>
	<slot />
</div>
