<script lang="ts">
    import { onMount } from 'svelte';

    import Button from '../common/input/Button.svelte';
    import QrCode from '../common/qrcode/QRCode.svelte';
    import Screen from '../common/screen/Screen.svelte';

    import Background from '$lib/common/Background.svelte';
    import { type ScreenHandle } from '$lib/common/screen/screen.js';
    import { t } from '$lib/i18n/i18n-context.js';
    import { ClipboardHelper } from '$lib/utils/clipboard-helper.js';
    import { invoke } from '$lib/utils/tauri.js';
    import { JustifyBaselineWrapper, Tooltip } from '@omuchatjs/ui';

    export let screen: ScreenHandle;
    export let props: {};
    let result: ShareResnponse | undefined;
    let url: string = '';
    let qrImage: HTMLImageElement;

    interface ShareResnponse {
        host: string;
        port: number;
    }

    onMount(async () => {
        invoke('share_url').then((res) => {
            console.log(`share_url: ${res}`);
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
</script>

<Screen {screen} title="remote_connect" windowed={false} disableDecorations>
    <Background />
    <div class="container">
        <div class="result">
            {#if result}
                <button on:click={copyQrToClipboard} class="qr">
                    <Tooltip>{$t('general.copy')}</Tooltip>
                    <QrCode value={url} size={128} bind:qrImage />
                </button>
                <div class="copy">
                    <Button on:click={copyUrlToClipboard}>
                        <Tooltip>{$t('general.copy')}</Tooltip>
                        {url}
                    </Button>
                </div>
            {/if}
        </div>
        <div class="close-button">
            <Button on:click={screen.pop} outline rounded filled>
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
        width: 100%;
        height: 100%;
    }

    .result {
        display: flex;
        flex-direction: column;
        gap: 40px;
        align-items: flex-start;
        justify-content: center;
        width: 400px;
        height: 100%;
        padding-left: 40px;
        background: var(--color-bg-1);
        outline: 2px solid var(--color-1);
    }

    .qr {
        top: 50%;
        width: 140px;
        height: 140px;
        padding: 0;
        background: var(--color-bg-2);
        border: none;

        &:hover {
            outline: 2px solid var(--color-1);
            outline-offset: 4px;
        }
    }

    .copy {
        font-weight: bold;
        background: var(--color-bg-2);
    }

    .close-button {
        position: absolute;
        bottom: 20px;
        left: 20px;
        margin-bottom: 40px;
    }
</style>
