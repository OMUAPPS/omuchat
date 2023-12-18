<script lang="ts">
    import { onMount } from 'svelte';
    
import Button from '../common/input/Button.svelte';
import QrCode from '../common/qrcode/QRCode.svelte';
import Screen from '../common/screen/Screen.svelte';
import Tooltip from '../common/tooltip/Tooltip.svelte';

    import FlexRowWrapper from '$lib/common/FlexRowWrapper.svelte';
    import JustifyBaselineWrapper from '$lib/common/JustifyBaselineWrapper.svelte';
    import { screenContext } from '$lib/common/screen/screen';
    import { t } from '$lib/i18n/i18n-context';
    import { ClipboardHelper } from '$lib/utils/clipboard-helper';
    import { invoke } from '$lib/utils/tauri';

    let result: ShareResult | undefined;
    let url: string = '';
    let qrImage: HTMLImageElement;

    interface ShareResult {
        host: string;
        port: number;
        url: string;
    }

    onMount(async () => {
        invoke('share_url').then((res) => {
            console.log(`share_url: ${res.url}`);
            result = res;
            url = `http://${res.host}:${res.port}/remote`;
        });
    });

    function copyUrlToClipboard() {
        ClipboardHelper.writeText(url);
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
        {#if result}
            <button on:click={copyQrToClipboard} class="qr">
                <Tooltip>{$t('general.copy')}</Tooltip>
                <QrCode value={url} size={150} bind:qrImage />
            </button>
            このQRコードをスキャンしてください
            <FlexRowWrapper gap between>
                <Tooltip>{$t('general.copy')}</Tooltip>
                <Button on:click={copyUrlToClipboard}>
                    {url}
                </Button>
            </FlexRowWrapper>
        {/if}
        <div class="close">
            <Button on:click={close} outline>
                <JustifyBaselineWrapper>
                    {$t('general.close')}
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
