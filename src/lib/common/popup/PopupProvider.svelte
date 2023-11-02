<script lang="ts">
	import type { ComponentType } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { PopupContext, PopupProps } from './popup';
	import { setPopupContext } from './popup';
	const stack: Writable<PopupProps[]> = writable([]);
	const context: PopupContext = {
		push: (props: PopupProps) => {
			stack.update((s) => [...s, props]);
		},
		pop: () => {
			stack.update((s) => s.slice(0, -1));
		}
	};
	setPopupContext(context);

	let component: ComponentType | null;

	$: if ($stack.length > 0) {
		component = $stack[$stack.length - 1].component;
	} else {
		component = null;
	}
</script>

{#if component}
	<svelte:component this={component} />
{/if}

<slot />
