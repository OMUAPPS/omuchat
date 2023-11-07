<script lang="ts">
	import type { PropedComponent } from '$lib/type/component';
	export let component: PropedComponent;
</script>

<svelte:component this={component.component} {...component.props} />
