<script lang="ts">
	export let between = false;
	export let reverse = false;
	export let widthFull = false;
	export let heightFull = false;
	export let baseline = false;
	export let gap = false;
</script>

<div class:between class:reverse class:widthFull class:heightFull class:baseline class:gap>
	<slot />
</div>

<style>
	div {
		display: flex;
		flex-direction: row;
	}

	.between {
		justify-content: space-between;
	}

	.reverse {
		flex-direction: row-reverse;
	}

	.widthFull {
		width: 100%;
	}

	.heightFull {
		height: 100%;
	}

	.baseline {
		align-items: baseline;
	}

	.gap {
		gap: 10px;
	}
</style>
