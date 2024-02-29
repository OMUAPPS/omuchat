<script lang="ts">
	export let between = false;
	export let reverse = false;
	export let widthFull = false;
	export let heightFull = false;
	export let center = false;
</script>

<div class:between class:reverse class:widthFull class:heightFull class:center>
	<slot />
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.between {
		justify-content: space-between;
	}

	.reverse {
		flex-direction: column-reverse;
	}

	.widthFull {
		width: 100%;
	}

	.heightFull {
		height: 100%;
	}

	.center {
		align-items: center;
	}
</style>
