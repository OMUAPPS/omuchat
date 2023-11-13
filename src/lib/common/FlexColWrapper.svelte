<script lang="ts">
	import { classes } from '$lib/util/class-helper';

	export let between = false;
	export let reverse = false;
	export let widthFull = false;
	export let heightFull = false;
</script>

<div
	class:between
	class:reverse
	class={classes('wrapper', widthFull && 'width-full', heightFull && 'height-full')}
>
	<slot />
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.between {
		justify-content: space-between;
	}

	.reverse {
		flex-direction: column-reverse;
	}

	.width-full {
		width: 100%;
	}

	.height-full {
		height: 100%;
	}
</style>
