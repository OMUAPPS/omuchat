<script>
	export let between = false;
	export let reverse = false;
	export let gap = false;
</script>

<div class="wrapper" class:between class:reverse class:gap>
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
</style>
