<script lang="ts">
	import QrCode from '../common/qrcode/QRCode.svelte';

	import Button from '$lib/common/Button.svelte';
	import FlexRowWrapper from '$lib/common/FlexRowWrapper.svelte';
	import JustifyBaselineWrapper from '$lib/common/JustifyBaselineWrapper.svelte';
	import { popupContext } from '$lib/common/popup/popup';
	import type { ShareResponse } from '$lib/type/tauri';
	import { ClipboardHelper } from '$lib/util/clipboard-helper';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Popup from '../common/popup/Popup.svelte';
	import Tooltip from '../common/tooltip/Tooltip.svelte';
	const result = writable<ShareResponse | null>(null);
	let qrImage: HTMLImageElement;

	onMount(async () => {
		const api = await import('@tauri-apps/api');
		api.invoke<ShareResponse>('share_url').then((res) => {
			console.log(res);
			result.set(res);
		});
	});

	function copyUrlToClipboard() {
		ClipboardHelper.writeText($result!.url);
	}

	function copyQrToClipboard() {
		ClipboardHelper.writeImage(qrImage);
	}

	function close() {
		popupContext.pop();
	}
</script>

<Popup title="remote_connect" windowed={false}>
	<div class="container">
		{#if $result}
			<button on:click={copyQrToClipboard} class="qr">
				<Tooltip>コピー</Tooltip>
				<QrCode value={$result.url} size={150} bind:qrImage />
			</button>
			このQRコードをスキャンしてください
			<FlexRowWrapper gap between>
				<Tooltip>コピー</Tooltip>
				<Button callback={copyUrlToClipboard}>
					{$result.host}:{$result.port}/
				</Button>
			</FlexRowWrapper>
		{/if}
		<div class="close">
			<Button callback={close} outline>
				<JustifyBaselineWrapper>
					閉じる
					<i class="ti ti-x" />
				</JustifyBaselineWrapper>
			</Button>
		</div>
	</div>
</Popup>

<style lang="scss">
	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		gap: 10px;
	}

	.close {
		position: absolute;
		bottom: 40px;
	}

	.qr {
		border: none;
		background: none;
		padding: 0;
		margin: 0;
		width: 150px;
		height: 150px;

		&:hover {
			outline: 2px solid var(--color-1);
			outline-offset: 4px;
		}
	}
</style>
