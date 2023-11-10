<script lang="ts">
	import FlexColWrapper from '$lib/common/FlexColWrapper.svelte';
	import ButtonOpenRemoteConnect from '$lib/common/titlebar/ButtonOpenRemoteConnect.svelte';
	import ButtonOpenSettings from '$lib/common/titlebar/ButtonOpenSettings.svelte';
	import PanelProvider from '$lib/panel/PanelProvider.svelte';
	import { writable } from 'svelte/store';
	import Tooltip from '../common/tooltip/Tooltip.svelte';
	import PopupSetup from './setup/PopupSetup.svelte';

	const pages = {
		messages: {
			name: 'Messages',
			icon: 'ti ti-message',
			component: PopupSetup,
			props: {}
		},
		settings: {
			name: 'Settings',
			icon: 'ti ti-settings',
			component: PopupSetup,
			props: {}
		}
	};

	const current = writable(pages.messages);
</script>

<div class="wrapper">
	<div class="tab-container">
		<FlexColWrapper>
			{#each Object.entries(pages) as [key, page]}
				<button
					class="page"
					on:click={() => {
						current.set(page);
					}}
					class:active={$current === page}
				>
					<Tooltip>{page.name}</Tooltip>
					<i class={page.icon} />
				</button>
			{/each}
		</FlexColWrapper>
		<FlexColWrapper>
			<ButtonOpenRemoteConnect />
			<ButtonOpenSettings />
		</FlexColWrapper>
	</div>
	<PanelProvider />
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		height: 100%;
		flex-direction: row;
		align-items: center;
	}

	.tab-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding-bottom: 40px;
		padding-top: 50px;
		width: 40px;
	}

	.page {
		width: 40px;
		height: 40px;
		outline: none;
		border: none;
		background: none;
		font-size: 16px;
		transition: 0.07s;

		&:hover {
			background: var(--color-bg-1);
		}

		&.active {
			background: var(--color-1);
			color: var(--color-bg-1);
		}
	}
</style>
