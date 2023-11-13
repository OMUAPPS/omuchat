<script lang="ts">
	export let sizes = [50, 50];
	export let direction: 'horizontal' | 'vertical' = 'horizontal';

	let leftStyle = '';
	let rightStyle = '';

	$: {
		if (direction === 'horizontal') {
			leftStyle = `width: ${sizes[0]}%;`;
			rightStyle = `width: ${sizes[1]}%;`;
		} else {
			leftStyle = `height: ${sizes[0]}%;`;
			rightStyle = `height: ${sizes[1]}%;`;
		}
	}
</script>

<div class="split" class:vertical={direction === 'vertical'}>
	<div class="split-left" style={leftStyle}>
		<slot name="left" />
	</div>
	<div class="split-right" style={rightStyle}>
		<slot name="right" />
	</div>
</div>

<style>
	.split {
		display: flex;
		flex-direction: row;
		gap: 10px;
		width: 100%;
		height: 100%;
	}

	.vertical {
		flex-direction: column;
	}

	.split-left,
	.split-right {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>
