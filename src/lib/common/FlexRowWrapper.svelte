<script>
	export let between = false;
	export let reverse = false;
	export let widthFull = false;
	export let heightFull = false;
	export let gap = false;
</script>

<div class="wrapper" class:between class:reverse class:gap class:widthFull class:heightFull>
	<slot />
</div>

<style>
	.wrapper {
		display: flex;

		/* height: 100%; */
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

	.widthFull {
		width: 100%;
	}

	.heightFull {
		height: 100%;
	}
</style>
