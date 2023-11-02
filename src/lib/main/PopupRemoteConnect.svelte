<script lang="ts">
	import QrCode from '../common/qrcode/QRCode.svelte';

	import Button from '$lib/common/Button.svelte';
	import FlexRowWrapper from '$lib/common/FlexRowWrapper.svelte';
	import JustifyBaselineWrapper from '$lib/common/JustifyBaselineWrapper.svelte';
	import Tooltip from '$lib/common/Tooltip.svelte';
	import { getPopupContext } from '$lib/common/popup/popup';
	import type { ShareResponse } from '$lib/type/tauri';
	import { ClipboardHelper } from '$lib/util/clipboard-helper';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Popup from '../common/popup/Popup.svelte';
	const result = writable<ShareResponse | null>(null);
	let qrImage: HTMLImageElement;

	onMount(async () => {
		const api = await import('@tauri-apps/api');
		api.invoke<ShareResponse>('share_url').then((res) => {
			console.log(res);
			result.set(res);
		});
	});

	const popup = getPopupContext();

	function copyUrlToClipboard() {
		ClipboardHelper.writeText($result!.url);
	}

	function copyQrToClipboard() {
		ClipboardHelper.writeImage(qrImage);
	}
</script>

<Popup title="リモート接続" icon="ti ti-qrcode" windowed={false}>
	<div class="container">
		{#if $result}
			<Tooltip text="コピー">
				<button on:click={copyQrToClipboard} class="qr">
					<QrCode value={$result.url} size={150} bind:qrImage />
				</button>
			</Tooltip>
			このQRコードをスキャンしてください
			<FlexRowWrapper gap between>
				<Tooltip text="コピー">
					<Button callback={copyUrlToClipboard}>
						{$result.host}:{$result.port}/
					</Button>
				</Tooltip>
			</FlexRowWrapper>
		{/if}
		<div class="close">
			<Button callback={() => popup.pop()} outline>
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
