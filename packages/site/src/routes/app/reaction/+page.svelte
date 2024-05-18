<script lang="ts">
    import { page } from '$app/stores';
    import { Identifier } from '@omujs/omu/identifier.js';
    import { AppHeader, ButtonMini, DragLink, FlexRowWrapper, Tooltip } from '@omujs/ui';
    import { BROWSER } from 'esm-env';
    import { omu } from './client.js';
    import ReactionRenderer from './components/ReactionRenderer.svelte';
    import { ReactionApp } from './reaction.js';

    function createAssetUrl() {
        const url = new URL($page.url);
        url.pathname = `${url.pathname}asset`;
        url.searchParams.set('assetId', Date.now().toString());
        return url;
    }

    const reactionApp = new ReactionApp(omu);
    const replaces = reactionApp.replaces;

    function test() {
        reactionApp.send('test', {
            '❤': 1,
            '😄': 1,
            '🎉': 1,
            '😳': 1,
            '💯': 1,
        });
    }

    let fileDrop: HTMLInputElement;
    let files: FileList | null;
    let fileCallback: () => void;

    function openFileDrop() {
        return new Promise<void>((resolve) => {
            fileCallback = resolve;
            fileDrop.click();
        });
    }

    async function handleReplace(key: string) {
        await openFileDrop();
        if (!files) return;
        const file = files[0];
        const reader = new FileReader();
        const id = omu.app.id.join('asset', key);
        reader.onload = async () => {
            const buffer = new Uint8Array(reader.result as ArrayBuffer);
            const asset = await omu.assets.upload(id, buffer);
            $replaces = { ...$replaces, [key]: asset.key() };
        };
        reader.readAsArrayBuffer(file);
    }

    if (BROWSER) {
        omu.start();
    }
</script>

<AppHeader app={omu.app} />
<main>
    <div class="preview">
        <ReactionRenderer {omu} {reactionApp} />
    </div>
    <h3>リアクションをテストする</h3>
    <section>
        <FlexRowWrapper gap>
            <button on:click={test}>
                <i class="ti ti-player-play" />
                テスト
            </button>
        </FlexRowWrapper>
    </section>

    <h3>OBSに貼り付ける</h3>
    <section>
        {#if BROWSER}
            <DragLink href={createAssetUrl}>
                <h3 slot="preview" class="drag-preview">
                    これをOBSにドロップ
                    <i class="ti ti-upload" />
                </h3>
                <div class="drag">
                    <i class="ti ti-drag-drop" />
                    ここをOBSにドラッグ&ドロップ
                </div>
            </DragLink>
        {/if}
    </section>

    <h3>画像を置き換える</h3>
    <section>
        <input
            type="file"
            bind:this={fileDrop}
            bind:files
            on:change={fileCallback}
            multiple
            hidden
        />
        {#each Object.entries($replaces) as [key, assetId]}
            <div class="replace-entry">
                <FlexRowWrapper alignItems="center" gap>
                    <h1>
                        {key}
                    </h1>
                    {#if assetId}
                        <i class="ti ti-chevron-right" />
                        <img
                            src={omu.assets.url(Identifier.fromKey(assetId), { noCache: true })}
                            alt={key}
                            class="replace-image"
                        />
                    {/if}
                </FlexRowWrapper>
                <FlexRowWrapper gap>
                    <button on:click={() => handleReplace(key)}>
                        <i class="ti ti-upload" />
                        置き換える
                    </button>
                    {#if assetId}
                        <ButtonMini on:click={() => ($replaces = { ...$replaces, [key]: null })}>
                            <Tooltip>置き換えを削除</Tooltip>
                            <i class="ti ti-trash" />
                        </ButtonMini>
                    {/if}
                </FlexRowWrapper>
            </div>
        {/each}
    </section>
</main>

<style lang="scss">
    main {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: flex-start;
        width: 100%;
        height: 100vh;
        padding: 40px;
    }

    .preview {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: -1;
    }

    .replace-entry {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: space-between;
        width: min(100%, 600px);
        padding: 10px 20px;
        background: var(--color-bg-2);
    }

    .replace-image {
        max-height: 50px;
        min-width: 50px;
        object-fit: contain;
    }

    .drag-preview {
        padding: 10px 20px;
        background: var(--color-bg-2);
    }

    .drag {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: var(--color-1);
        background: var(--color-bg-2);
        outline: 2px solid var(--color-1);
        padding: 10px;
        gap: 5px;
        cursor: grab;

        & > i {
            font-size: 20px;
        }

        &:hover {
            margin-left: 4px;
            outline: 2px solid var(--color-1);
            box-shadow: -4px 4px 0 2px var(--color-2);
            transition: 0.06233s;
        }
    }

    h1 {
        font-family: 'Noto Color Emoji';
    }

    h3 {
        color: var(--color-1);
        margin-bottom: 10px;
    }

    section {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: start;
        justify-content: flex-start;
        width: 100%;
        padding: 0px;
        margin-bottom: 20px;
    }

    img {
        max-width: 100%;
        max-height: 40px;
    }

    button {
        background: none;
        border: none;
        cursor: pointer;
        margin: 0;
        height: 30px;
        padding: 10px;
        display: flex;
        font-size: 14px;
        align-items: center;
        justify-content: center;
        color: var(--color-1);
        background: var(--color-bg-2);
        outline: 1px solid var(--color-1);
        outline-offset: -1px;
        border-radius: 4px;

        &:hover {
            background: var(--color-bg-1);
        }

        &:active {
            background: var(--color-1);
            color: var(--color-bg-2);
        }
    }
</style>
