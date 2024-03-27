<script lang="ts">
    import { ButtonMini, FlexColWrapper, FlexRowWrapper, Tooltip } from '@omuchatjs/ui';
    import { client } from './client.js';
    import { deleteEmoji, saveEmoji, type Emoji, type Pettern } from './emoji.js';

    export let emoji: Emoji;

    let type: Pettern['type'] = 'text';

    function addPettern() {
        let newPettern: Pettern;
        if (type === 'text') {
            newPettern = {
                type: 'text',
                text: '',
            };
        } else if (type === 'regex') {
            newPettern = {
                type: 'regex',
                regex: '',
            };
        } else if (type === 'image') {
            newPettern = {
                type: 'image',
                id: '',
            };
        } else {
            throw new Error(`Unknown type: ${type}`);
        }
        emoji.petterns = [...emoji.petterns, newPettern];
    }
</script>

<div class="emoji-edit">
    <div class="left">
        <img src={client.assets.url(emoji.asset)} alt={emoji.asset.key()} />
    </div>
    <FlexColWrapper widthFull gap>
        <FlexRowWrapper widthFull between>
            <FlexRowWrapper baseline gap>
                <small>名前</small>
                <input class="name" type="text" bind:value={emoji.id} placeholder="Name" />
            </FlexRowWrapper>
            <FlexRowWrapper gap>
                <ButtonMini on:click={() => saveEmoji(emoji)}>
                    <Tooltip>保存</Tooltip>
                    <i class="ti ti-device-floppy" />
                </ButtonMini>
                <ButtonMini on:click={() => deleteEmoji(emoji)}>
                    <Tooltip>削除</Tooltip>
                    <i class="ti ti-trash" />
                </ButtonMini>
            </FlexRowWrapper>
        </FlexRowWrapper>
        <div class="petterns">
            <small>パターン</small>
            {#each emoji.petterns as pettern}
                <div class="pettern">
                    <FlexRowWrapper widthFull between baseline>
                        {#if pettern.type === 'text'}
                            文字
                            <input type="text" bind:value={pettern.text} placeholder="text" />
                        {:else if pettern.type === 'image'}
                            絵文字
                            <input type="text" bind:value={pettern.id} placeholder="image id" />
                        {:else if pettern.type === 'regex'}
                            正規表現
                            <input type="text" bind:value={pettern.regex} placeholder="regex" />
                        {/if}
                    </FlexRowWrapper>
                    <ButtonMini
                        on:click={() =>
                            (emoji.petterns = emoji.petterns.filter((p) => p !== pettern))}
                    >
                        <Tooltip>削除</Tooltip>
                        <i class="ti ti-trash" />
                    </ButtonMini>
                </div>
            {/each}
            <FlexRowWrapper widthFull baseline gap>
                <small>タイプ</small>
                <select bind:value={type} class="type">
                    <option value="text">テキスト</option>
                    <option value="regex">正規表現</option>
                    <option value="image">画像</option>
                </select>
                <ButtonMini on:click={() => addPettern()}>
                    <Tooltip>追加</Tooltip>
                    <i class="ti ti-plus" />
                </ButtonMini>
            </FlexRowWrapper>
        </div>
    </FlexColWrapper>
</div>

<style lang="scss">
    .emoji-edit {
        display: flex;
        flex-direction: row;
        gap: 10px;
        width: 600px;
        padding: 10px;
        background: var(--color-bg-2);
    }

    .left {
        display: flex;
        flex-direction: column;
        gap: 10px;
        justify-content: center;
        width: 100px;
        height: 100%;
    }

    .petterns {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        padding: 10px;
        background: var(--color-bg-1);
    }

    .pettern {
        display: flex;
        flex-direction: row;
        gap: 10px;
        justify-content: space-between;
        border-left: 2px solid var(--color-1);
        padding-left: 10px;
    }

    img {
        height: 100px;
        margin-right: 10px;
        object-fit: contain;
    }

    .name {
        font-size: 1.2em;
        font-weight: bold;
        color: var(--color-1);
        border: none;
        border-bottom: 2px solid var(--color-1);
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        font-size: 1.2em;
        color: var(--color-1);
        cursor: pointer;
        background: var(--color-bg-1);
        border: none;
    }

    small {
        font-size: 0.8em;
        font-weight: bold;
        color: var(--color-1);
    }
</style>
