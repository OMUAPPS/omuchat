<script lang="ts">
	export let between = false;
	export let reverse = false;
</script>

<div class="wrapper" class:between class:reverse>
	<slot />
</div>

<style>
	.wrapper {
		display: flex;
		height: 100%;
		flex-direction: column;
		align-items: center;
	}

	.between {
		justify-content: space-between;
	}

	.reverse {
		flex-direction: column-reverse;
	}

	.align-start {
		align-items: flex-start;
	}

	.align-center {
		align-items: center;
	}

	.align-end {
		align-items: flex-end;
	}
</style>
