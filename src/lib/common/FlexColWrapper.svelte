<script lang="ts">
	export let between = false;
	export let reverse = false;
	export let widthFull = false;
	export let heightFull = false;
</script>

<div class="wrapper" class:between class:reverse class:widthFull class:heightFull>
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

	.widthFull {
		width: 100%;
	}

	.heightFull {
		height: 100%;
	}
</style>
