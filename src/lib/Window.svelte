<script lang="ts">
	import { PluginInfo } from '@omuchat/client';
	import FlexRowWrapper from './common/FlexRowWrapper.svelte';
	import OmuChatProvider from './common/omuchat/OmuChatProvider.svelte';
	import StatusBar from './common/omuchat/StatusBar.svelte';
	import PopupProvider from './common/popup/PopupProvider.svelte';
	import ButtonClose from './common/titlebar/ButtonClose.svelte';
	import ButtonMaximize from './common/titlebar/ButtonMaximize.svelte';
	import ButtonMinimize from './common/titlebar/ButtonMinimize.svelte';
	import ButtonRemoteConnect from './common/titlebar/ButtonRemoteConnect.svelte';
	import TitleBar from './common/titlebar/TitleBar.svelte';
	import Title from './images/title.svg';
</script>

<div class="window">
	<OmuChatProvider info={PluginInfo.create({ name: 'test', version: '0.0.1', group: 'test' })}>
		<PopupProvider>
			<div class="drag-area" data-tauri-drag-region>
				<div class="title">
					<img src={Title} alt="title" width="64" height="10" />
					<StatusBar />
				</div>
				<TitleBar>
					<FlexRowWrapper>
						<ButtonRemoteConnect />
						<ButtonMinimize />
						<ButtonMaximize />
						<ButtonClose />
					</FlexRowWrapper>
				</TitleBar>
			</div>
			<div class="content">
				<slot />
			</div>
		</PopupProvider>
	</OmuChatProvider>
</div>

<style>
	.drag-area {
		outline: 1px solid var(--color-outline);
		background: var(--color-bg-2);
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 40px;
		z-index: 1000;
		user-select: none;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.title {
		margin-left: 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}

	.window {
		outline: 2px solid var(--color-1);
		outline-offset: -1px;
		background-color: var(--color-bg-2);
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}

	.content {
		position: absolute;
		top: 40px;
		width: 100%;
		height: calc(100% - 40px);
		overflow: hidden;
		background: var(--color-bg-2);
	}
</style>
