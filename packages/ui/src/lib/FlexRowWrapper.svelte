<script lang="ts">
	import { style } from './utils/class-helper.js';

	export let between = false;
	export let reverse = false;
	export let widthFull = false;
	export let heightFull = false;
	export let baseline = false;
	export let gap = false;
	export let alignItems: 'start' | 'center' | 'end' | undefined = undefined;
</script>

<div
	class:between
	class:reverse
	class:width={widthFull}
	class:height={heightFull}
	class:gap
	class:baseline
	style={style({ alignItems })}
>
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

	.width {
		width: 100%;
	}

	.height {
		height: 100%;
	}

	.gap {
		gap: 10px;
	}

	.baseline {
		align-items: baseline;
	}
</style>
