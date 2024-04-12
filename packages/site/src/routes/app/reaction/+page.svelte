<script lang="ts">
    import { page } from '$app/stores';
    import { Identifier } from '@omuchatjs/omu/identifier.js';
    import { AppHeader, FlexRowWrapper } from '@omuchatjs/ui';
    import { client } from './client.js';
    import ReactionRenderer from './components/ReactionRenderer.svelte';
    import { REACTION_MESSAGE_TYPE, REACTION_REPLACE_REGISTRY_TYPE } from './reaction.js';

    let assetUrl = $page.url.toString() + 'asset?id=' + Date.now();

    const reactionsMessage = client.message.get(REACTION_MESSAGE_TYPE);
    const replacesRegistry = client.registry.get(REACTION_REPLACE_REGISTRY_TYPE);

    function test() {
        reactionsMessage.broadcast({
            room_id: 'test',
            reactions: {
                '😳': 1,
                '😄': 1,
                '❤': 1,
                '🎉': 1,
                '💯': 1,
            },
        });
    }

    let replaces: Record<string, string | null> = {};

    replacesRegistry.listen((registry) => {
        replaces = {
            '😳': null,
            '😄': null,
            '❤': null,
            '🎉': null,
            '💯': null,
            ...registry,
        };
    });

    function setReplace(key: string, assetId: string) {
        replacesRegistry.update((registry) => {
            registry[key] = assetId;
            return registry;
        });
    }

    function removeReplace(key: string) {
        replacesRegistry.update((registry) => {
            registry[key] = null;
            return registry;
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
        const identifier = client.app.identifier.join('asset', key);
        reader.onload = async () => {
            const buffer = new Uint8Array(reader.result as ArrayBuffer);
            const asset = await client.assets.upload({
                buffer,
                identifier,
            });
            setReplace(key, asset[0].key());
        };
        reader.readAsArrayBuffer(file);
    }
</script>

<AppHeader app={client.app} />
<main>
    <div class="preview">
        <ReactionRenderer {client} />
    </div>
    <section>
        <FlexRowWrapper gap>
            <button on:click={test}>
                <i class="ti ti-send" />
                Send
            </button>
        </FlexRowWrapper>
    </section>
    <h3>貼り付け</h3>
    <section>
        <a href={assetUrl} target="_blank">
            <img src={assetUrl} alt="asset" />
        </a>
    </section>
    <input type="file" bind:this={fileDrop} bind:files on:change={fileCallback} multiple hidden />
    <section>
        {#each Object.entries(replaces) as [key, assetId]}
            <FlexRowWrapper gap>
                <button on:click={() => handleReplace(key)}>
                    <i class="ti ti-upload" />
                    Replace {key}
                </button>
                <span>{key}</span>
                <span>{assetId}</span>
                {#if assetId}
                    <img src={client.assets.url(Identifier.fromKey(assetId), true)} alt={key} />
                {/if}
                <button on:click={() => removeReplace(key)}>
                    <i class="ti ti-trash" />
                    Remove {key}
                </button>
            </FlexRowWrapper>
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
        background: var(--color-bg-1);
        padding: 40px;
    }

    .preview {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
        background: var(--color-bg-2);
    }

    h3 {
        color: var(--color-1);
        margin-bottom: 10px;
    }

    section {
        display: flex;
        flex-direction: column;
        gap: 20px;
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
