<script lang="ts">
	import FlexColWrapper from '$lib/common/FlexColWrapper.svelte';
	import FlexRowWrapper from '$lib/common/FlexRowWrapper.svelte';
	import type { AppMetadata } from '$lib/common/omuchat/app-metadata.js';
	import { tauriWindow } from '$lib/utils/tauri.js';

	export let entry: AppMetadata;
	export let selected: boolean = false;

	function openApp() {
		const window = new tauriWindow.WebviewWindow(entry.url, {
			url: entry.url,
			title: entry.name
		});
		window.setFocus();
	}
</script>

<button on:click={openApp} class:selected>
	<FlexRowWrapper widthFull between>
		<FlexRowWrapper>
			<div class="icon">
				{#if entry.icon?.startsWith('http')}
					<img src={entry.icon} alt="icon" />
				{:else}
					<i class="ti ti-{entry.icon ?? `box`}" />
				{/if}
			</div>
			<FlexColWrapper>
				<div class="name">{entry.name}</div>
				<small>
					{entry.author}
				</small>
			</FlexColWrapper>
		</FlexRowWrapper>
		<div class="right">
			起動する
			<i class="ti ti-arrow-right" />
		</div>
	</FlexRowWrapper>
</button>

<style lang="scss">
	button {
		width: 100%;
		height: fit-content;
		padding: 15px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-1);
		cursor: pointer;
		background: var(--color-bg-2);
		border: none;
		outline: none;
		outline-offset: -5px;
		margin-bottom: 10px;
	}

	.selected:hover {
		background: var(--color-bg-1);
		outline: 1px solid var(--color-1);
		transition: 0.06s;

		.right {
			margin-right: 5px;
			visibility: visible;
			transition: 0.06s;
		}
	}

	.right {
		display: flex;
		flex-direction: column;
		gap: 5px;
		align-items: flex-end;
		margin-right: 10px;
		visibility: hidden;
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		margin-right: 10px;
		overflow: hidden;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		i {
			font-size: 22px;
		}
	}

	.name {
		font-size: 16px;
		font-weight: 700;
	}

	small {
		font-size: 12px;
		font-weight: 400;
	}
</style>
