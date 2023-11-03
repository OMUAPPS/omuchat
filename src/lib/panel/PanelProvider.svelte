<script lang="ts">
	import FlexRowWrapper from '$lib/common/FlexRowWrapper.svelte';
	import QrCode from '$lib/common/qrcode/QRCode.svelte';
	import { createPanelContext } from './panel';

	const context = createPanelContext();
	const panels = context.panels;
	context.registerPanel({
		name: 'test',
		component: () => QrCode
	});
	context.registerPanel({
		name: 'test',
		component: () => QrCode
	});
	context.registerPanel({
		name: 'test',
		component: () => QrCode
	});
	context.registerPanel({
		name: 'test',
		component: () => QrCode
	});
	context.registerPanel({
		name: 'test',
		component: () => QrCode
	});
</script>

<div class="container">
	<FlexRowWrapper>
		{#each $panels as panel}
			<svelte:component this={panel.component()} />
		{/each}
	</FlexRowWrapper>
</div>

<style>
	.container {
		height: 100%;
		width: 100%;
		overflow-x: scroll;
	}
</style>
