<script lang="ts">
    import { Author } from '@omuchatjs/chat/models/author.js';
    import { content } from '@omuchatjs/chat/models/index.js';
    import {
        ButtonMini,
        ComboBox,
        FlexColWrapper,
        FlexRowWrapper,
        MessageRenderer,
        Tooltip,
    } from '@omuchatjs/ui';
    import { client } from './client.js';
    import dummy_icon from './dummy_icon.svg';
    import { deleteEmoji, saveEmoji, type Emoji, type Pettern } from './emoji.js';

    export let emoji: Emoji;

    function addPettern(newPettern: Pettern) {
        emoji.petterns = [...emoji.petterns, newPettern];
    }

    const petternFactory: { [key: string]: { value: () => Pettern; label: string } } = {
        text: {
            value: () => ({ type: 'text', text: '' }),
            label: '文字',
        },
        regex: {
            value: () => ({ type: 'regex', regex: '' }),
            label: '正規表現',
        },
        image: {
            value: () => ({ type: 'image', id: '' }),
            label: '絵文字',
        },
    };
</script>

<FlexRowWrapper widthFull gap>
    <div class="preview">
        <MessageRenderer
            author={new Author({
                providerId: 'test',
                id: 'test',
                name: 'test',
                avatarUrl: new URL(dummy_icon, window.location.origin).toString(),
            })}
            content={new content.Root([
                new content.Image(client.assets.url(emoji.asset), emoji.asset.key()),
            ])}
        />
        <MessageRenderer
            author={new Author({
                providerId: 'test',
                id: 'test',
                name: 'test',
                avatarUrl: new URL(dummy_icon, window.location.origin).toString(),
            })}
            content={new content.Root([
                new content.Text(emoji.id),
                new content.Image(client.assets.url(emoji.asset), emoji.asset.key()),
            ])}
        />
        <MessageRenderer
            author={new Author({
                providerId: 'test',
                id: 'test',
                name: 'test',
                avatarUrl: new URL(dummy_icon, window.location.origin).toString(),
            })}
            content={new content.Root([
                new content.Image(client.assets.url(emoji.asset), emoji.asset.key()),
                new content.Image(client.assets.url(emoji.asset), emoji.asset.key()),
                new content.Image(client.assets.url(emoji.asset), emoji.asset.key()),
            ])}
        />
    </div>
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
                    <FlexRowWrapper widthFull between gap>
                        <div class="pettern">
                            <FlexRowWrapper widthFull between baseline>
                                {#if pettern.type === 'text'}
                                    <span>
                                        <i class="ti ti-txt" />
                                        文字
                                    </span>
                                    <input
                                        type="text"
                                        bind:value={pettern.text}
                                        placeholder="text"
                                    />
                                {:else if pettern.type === 'image'}
                                    <span>
                                        <i class="ti ti-photo" />
                                        絵文字
                                    </span>
                                    <input
                                        type="text"
                                        bind:value={pettern.id}
                                        placeholder="image id"
                                    />
                                {:else if pettern.type === 'regex'}
                                    <span>
                                        <i class="ti ti-regex" />
                                        正規表現
                                    </span>
                                    <input
                                        type="text"
                                        bind:value={pettern.regex}
                                        placeholder="regex"
                                    />
                                {/if}
                            </FlexRowWrapper>
                        </div>
                        <ButtonMini
                            on:click={() =>
                                (emoji.petterns = emoji.petterns.filter((p) => p !== pettern))}
                        >
                            <Tooltip>削除</Tooltip>
                            <i class="ti ti-trash" />
                        </ButtonMini>
                    </FlexRowWrapper>
                {/each}
                <FlexRowWrapper widthFull baseline gap>
                    <small>パターンを追加</small>
                    <ComboBox
                        options={petternFactory}
                        handleChange={(key, value) => addPettern(value())}
                    />
                </FlexRowWrapper>
            </div>
        </FlexColWrapper>
    </div>
</FlexRowWrapper>

<style lang="scss">
    .emoji-edit {
        display: flex;
        flex-direction: row;
        gap: 10px;
        width: 600px;
        padding: 10px;
        background: var(--color-bg-2);
    }

    .preview {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        padding: 10px;
        background: var(--color-bg-2);
    }

    .left {
        display: flex;
        flex-direction: column;
        margin: 10px;
        gap: 10px;
        width: 100px;
        height: 100%;
    }

    .petterns {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 10px;
        gap: 10px;
        background: var(--color-bg-1);
    }

    .pettern {
        display: flex;
        flex-direction: row;
        gap: 10px;
        justify-content: space-between;
        align-items: baseline;
        padding: 2px 0;
        background: var(--color-bg-2);
        padding-left: 10px;
        font-size: 0.8rem;
        font-weight: 600;
        width: 100%;
        color: var(--color-1);

        input {
            padding: 5px;
            border: 1px solid var(--color-1);
            background: var(--color-bg-2);
            color: var(--color-1);
        }
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

    small {
        font-size: 0.8em;
        font-weight: bold;
        color: var(--color-1);
    }
</style>
