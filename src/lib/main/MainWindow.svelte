<script lang="ts">
	import Component from '$lib/common/Component.svelte';
	import FlexColWrapper from '$lib/common/FlexColWrapper.svelte';
	import PanelProvider from '$lib/panel/PanelProvider.svelte';
	import { style } from '$lib/util/class-helper';
	import Tooltip from '../common/tooltip/Tooltip.svelte';
	import ButtonOpenRemoteConnect from './ButtonOpenRemoteConnect.svelte';
	import ButtonOpenSettings from './ButtonOpenSettings.svelte';
	import PageAssets from './page/PageAssets.svelte';
	import PageChannels from './page/PageChannels.svelte';
	import PageHome from './page/PageHome.svelte';
	import PageMessages from './page/PageMessages.svelte';
	import { currentPage, pages } from './page/page';

	pages.set([
		{
			title: 'メイン',
			icon: 'ti ti-home',
			component: () => {
				return {
					component: PageHome,
					props: {}
				};
			}
		},
		{
			title: 'メッセージ',
			icon: 'ti ti-message',
			component: () => {
				return {
					component: PageMessages,
					props: {}
				};
			}
		},
		{
			title: 'チャンネル',
			icon: 'ti ti-plug',
			component: () => {
				return {
					component: PageChannels,
					props: {}
				};
			}
		},
		{
			title: 'アセット',
			icon: 'ti ti-package',
			component: () => {
				return {
					component: PageAssets,
					props: {}
				};
			}
		},
		{
			title: '開発',
			icon: 'ti ti-bug',
			component: () => {
				return {
					component: PanelProvider,
					props: {}
				};
			}
		}
	]);
	currentPage.set($pages[0]);
</script>

<div class="wrapper">
	<div class="tab-container">
		<FlexColWrapper>
			{#each Object.values($pages) as page}
				<button
					class="page"
					on:click={() => {
						currentPage.set(page);
					}}
					class:active={$currentPage === page}
				>
					<Tooltip>{page.title}</Tooltip>
					<i class={page.icon} />
				</button>
			{/each}
		</FlexColWrapper>
		<FlexColWrapper>
			<ButtonOpenRemoteConnect />
			<ButtonOpenSettings />
		</FlexColWrapper>
	</div>
	{#each $pages as page}
		<div style={style({ display: $currentPage === page ? '' : 'none' })} class="page-container">
			<Component component={page.component()} />
		</div>
	{/each}
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
		// transition: 0.05s;

		&:hover {
			background-color: color-mix(in srgb, var(--color-1) 10%, transparent);
			// color: var(--color-bg-2);
		}

		&.active {
			background: var(--color-1);
			color: var(--color-bg-1);
		}
	}

	.page-container {
		width: calc(100% - 40px);
		height: 100%;
	}
</style>
