<script>
	import { classes } from '$lib/util/class-helper';

	export let between = false;
	export let reverse = false;
	export let widthFull = false;
	export let heightFull = false;
	export let gap = false;
</script>

<div
	class:between
	class:reverse
	class:gap
	class={classes('wrapper', widthFull && 'width-full', heightFull && 'height-full')}
>
	<slot />
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.between {
		justify-content: space-between;
	}

	.reverse {
		flex-direction: row-reverse;
	}

	.gap {
		gap: 10px;
	}

	.width-full {
		width: 100%;
	}

	.height-full {
		height: 100%;
	}
</style>
