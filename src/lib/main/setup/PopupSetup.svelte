<script lang="ts">
	import Background from '$lib/common/Background.svelte';
	import Button from '$lib/common/Button.svelte';
	import FlexColWrapper from '$lib/common/FlexColWrapper.svelte';
	import InputText from '$lib/common/input/InputText.svelte';
	import PopupHeader from '$lib/common/popup/PopupHeader.svelte';
	import { getPopupContext } from '$lib/common/popup/popup';
	import type { ChannelInfo } from '@/omuchat';
	import axios from 'axios';
	import Popup from '../../common/popup/Popup.svelte';
	import ChannelEntry from './ChannelEntry.svelte';

	const popup = getPopupContext();

	interface Response {
		channels: ChannelInfo[];
	}

	let result: Record<string, { info: ChannelInfo; active: boolean }> | null = null;

	let locked = false;
	let url: string = '';

	function fetchChannels() {
		if (locked) return;
		locked = true;
		axios
			.get<Response>('http://localhost:26423/setup/tree', {
				params: {
					url
				}
			})
			.then((res) => {
				console.log(res);
				result = res.data.channels.reduce((acc, channel) => {
					acc[channel.url] = {
						info: channel,
						active: false
					};
					return acc;
				}, {} as Record<string, { info: ChannelInfo; active: boolean }>);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				locked = false;
			});
	}

	function finish() {
		// TODO
		popup.pop();
	}

	function reset() {
		result = null;
	}
</script>

<Popup title="セットアップ" icon="ti ti-qrcode" windowed={false} decorated={false}>
	<Background />
	<div class="container">
		<PopupHeader title="セットアップ" icon="ti ti-login-2" />
		{#if result}
			<FlexColWrapper>
				<div class="channels">
					{#each Object.keys(result) as url}
						<ChannelEntry
							channel={result[url].info}
							active={result[url].active}
							callback={() => {
								if (!result) return;
								result[url].active = !result[url].active;
							}}
						/>
					{/each}
				</div>
				<div class="buttons">
					<Button
						outline
						rounded
						callback={finish}
						disabled={locked || Object.values(result).every((v) => !v.active)}
					>
						追加する
						<i class="ti ti-arrow-right" />
					</Button>
					<Button rounded callback={reset} disabled={locked}>
						<i class="ti ti-arrow-left" />
						戻る
					</Button>
				</div>
			</FlexColWrapper>
		{:else}
			<div>
				チャンネルurlを入力するだけ
				<InputText placeholder="url..." bind:value={url} />
			</div>
			<div class="buttons">
				<Button outline rounded callback={fetchChannels} disabled={!url || locked}>
					次へ
					<i class="ti ti-arrow-right" />
				</Button>
				<Button rounded callback={popup.pop}>
					スキップ
					<i class="ti ti-arrow-right" />
				</Button>
			</div>
		{/if}
	</div>
</Popup>

<style lang="scss">
	.container {
		position: fixed;
		top: 40px;
		left: 0;
		bottom: 0;
		width: 20%;
		min-width: 300px;
		background: var(--color-bg-2);
		outline: 2px solid var(--color-1);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		gap: 60px;
		padding-top: 60px;
		padding-left: 40px;
		padding-right: 40px;
	}

	.channels {
		width: 100%;
		height: 60%;
		overflow-y: auto;
		display: flex;
		flex-direction: column;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.buttons {
		width: 100%;
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
		margin-top: 60px;
	}
</style>
