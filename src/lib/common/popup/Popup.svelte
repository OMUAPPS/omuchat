<script lang="ts">
	import PopupHeader from './PopupHeader.svelte';
	import { getPopupContext } from './popup';

	export let title: string;
	export let icon: string;
	export let windowed: boolean = true;
	export let decorated: boolean = true;
	const popup = getPopupContext();
	let container: HTMLButtonElement;

	function onClick(event: MouseEvent) {
		if (event.target === container) {
			popup.pop();
		}
	}
</script>

<button class="container" class:windowed on:click={onClick} bind:this={container}>
	<div class="popup" class:windowed>
		{#if windowed && decorated}
			<PopupHeader {title} {icon} />
		{/if}
		<div class="content" class:windowed>
			{#if !windowed && decorated}
				<PopupHeader {title} {icon} />
			{/if}
			<slot />
		</div>
	</div>
</button>

<style lang="scss">
	.container {
		appearance: none;
		border: none;
		background: none;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(246, 243, 235, 0.9);
		z-index: 100;
		overflow: hidden;
	}

	.popup {
		animation: menuIn 0.2s cubic-bezier(0, 1.14, 0, 1);
		animation-fill-mode: forwards;
		&:not(.windowed) {
			width: 100%;
			height: 100%;
		}
		max-width: 100%;
		max-height: 100%;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-shrink: 0;
		background: var(--color-bg-2);
		overflow: hidden;

		&.windowed {
			width: 500px;
			height: 300px;
			border: 2px solid var(--color-1);
			box-shadow: 0 8px 0 0 var(--color-2);
		}
		&:not(.windowed) {
			position: absolute;
			top: 40px;
			width: 100%;
			height: calc(100% - 40px);
			padding-top: 40px;
		}
	}

	@keyframes menuIn {
		0% {
			transform: scale(0);
			opacity: 0;
		}

		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes menuOut {
		0% {
			transform: scale(1);
			opacity: 1;
		}

		100% {
			transform: scale(0);
			opacity: 0;
		}
	}
</style>
