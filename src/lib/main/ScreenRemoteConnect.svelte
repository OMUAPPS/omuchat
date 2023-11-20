<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    import Button from '../common/input/Button.svelte';
    import QrCode from '../common/qrcode/QRCode.svelte';
    import Screen from '../common/screen/Screen.svelte';
    import Tooltip from '../common/tooltip/Tooltip.svelte';

    import FlexRowWrapper from '$lib/common/FlexRowWrapper.svelte';
    import JustifyBaselineWrapper from '$lib/common/JustifyBaselineWrapper.svelte';
    import { screenContext } from '$lib/common/screen/screen';
    import { ClipboardHelper } from '$lib/util/clipboard-helper';

    const result = writable<ShareResult | null>(null);
    let qrImage: HTMLImageElement;

    interface ShareResult {
        host: string;
        port: number;
        url: string;
    }

    onMount(async () => {
        const api = await import('@tauri-apps/api');
        api.invoke<ShareResult>('share_url').then((res) => {
            console.log(`share_url: ${res.url}`);
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
        screenContext.pop();
    }
</script>

<Screen title="remote_connect" windowed={false}>
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
</Screen>

<style lang="scss">
    .container {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .close {
        position: absolute;
        bottom: 40px;
    }

    .qr {
        width: 150px;
        height: 150px;
        padding: 0;
        margin: 0;
        background: none;
        border: none;

        &:hover {
            outline: 2px solid var(--color-1);
            outline-offset: 4px;
        }
    }
</style>
