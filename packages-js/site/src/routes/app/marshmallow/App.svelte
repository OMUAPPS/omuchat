<script lang="ts">
    import { page } from '$app/stores';
    import { DragLink, Tooltip } from '@omujs/ui';
    import AccountSwitcher from './components/AccountSwitcher.svelte';
    import MessageView from './components/MessageView.svelte';
    import SelectUser from './components/SelectUser.svelte';
    import { MarshmallowApp, type Message, type User } from './marshmallow-app.js';

    export let marshmallow: MarshmallowApp;
    const { config, data } = marshmallow;

    let user: User | null = null;
    let users: Record<string, User> | null = null;

    marshmallow.refreshUsers().then((res) => {
        users = res;
        users['test'] = {
            name: 'test',
            screen_name: 'Test User',
            image: 'https://via.placeholder.com/150',
        };
        console.log(users);
        if ($config.user) {
            user = users[$config.user];
            return;
        }
        if (users && Object.keys(users).length === 1) {
            user = users[Object.keys(users)[0]];
        }
    });

    $: {
        $config.user = user?.name || null;
    }

    let messages: Message[] = [];

    $: {
        if (user) {
            messages = [];
            marshmallow.getMessages(user.name).then((res) => {
                console.log(res);
                messages = res;
            });
        }
    }

    function createAssetUrl() {
        const url = new URL($page.url);
        url.pathname = `${url.pathname}asset`;
        url.searchParams.set('assetId', Date.now().toString());
        return url;
    }
</script>

<main>
    <div class="left">
        <AccountSwitcher {users} bind:user />
        <div class="messages">
            {#each messages as item}
                {@const selected = $data.message === item}
                <button class="message" class:selected on:click={() => ($data.message = item)}>
                    <Tooltip>
                        クリックでメッセージを表示
                        <i class="ti ti-chevron-right" />
                    </Tooltip>
                    <p>{item.content}</p>
                    <button class="like">
                        <Tooltip>お気に入りにする</Tooltip>
                        {#if item.liked}
                            <i class="ti ti-heart-filled" />
                        {:else}
                            <i class="ti ti-heart" />
                        {/if}
                    </button>
                </button>
            {/each}
            {#if $data.message}
                <button on:click={() => ($data.message = null)} class="message hide">
                    <Tooltip>
                        表示中のメッセージを閉じる
                        <i class="ti ti-chevron-right" />
                    </Tooltip>
                    <p>メッセージを閉じる</p>
                    <i class="ti ti-x" />
                </button>
            {/if}
        </div>
    </div>
    <div class="right">
        {#if $data.message}
            <MessageView {marshmallow} message={$data.message} />
        {:else}
            <div class="select-message">
                メッセージを選択してください。
                <small> メッセージを選択すると、メッセージを表示できます。 </small>
            </div>
        {/if}
        <small class="drag-hint">
            OBS内で使用する場合は、
            <br />
            以下のボタンからドラッグ&ドロップしてください。
        </small>
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
    </div>
</main>
{#if users && !user}
    <SelectUser {users} bind:user />
{/if}

<style lang="scss">
    main {
        position: relative;
        display: flex;
        flex-direction: row;
        height: 100%;
    }

    .messages {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;

        > .message {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 1rem 2rem;
            padding-right: 1rem;
            border: none;
            background: var(--color-bg-2);
            border-bottom: 1px solid var(--color-outline);
            width: 100%;
            cursor: pointer;

            > p {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            > button {
                background: none;
                border: none;
                cursor: pointer;
                min-width: none;
                width: 2rem;
                height: 2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--color-1);
            }

            > .like {
                margin-left: auto;
                background: none;
                border: none;
                cursor: pointer;
                min-width: 2rem;
                height: 2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--color-1);
            }
            
            &.selected,
            &:focus,
            &:hover {
                background: var(--color-bg-1);
                color: var(--color-1);
                padding-left: 2.25rem;
                transition-duration: 0.0621s;
                transition-property: padding-left, background, color;
            }
        }
    }

    .hide {
        margin-top: auto;
    }

    .left {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 300px;
        min-width: 300px;
        display: flex;
        flex-direction: column;
        background: var(--color-bg-2);
        border-right: 1px solid var(--color-outline);
    }

    .right {
        position: absolute;
        left: 300px;
        right: 0;
        top: 0;
        bottom: 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        gap: 1rem;
    }

    .select-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        color: var(--color-1);
    }

    .drag-hint {
        margin-top: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: 1rem;
        color: var(--color-1);
    }

    .drag-preview {
        padding: 10px 20px;
        background: var(--color-bg-2);
    }

    .drag {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--color-1);
        background: var(--color-bg-2);
        outline: 2px solid var(--color-1);
        padding: 10px;
        margin: 1rem;
        gap: 5px;
        cursor: grab;

        & > i {
            font-size: 20px;
        }

        &:hover {
            transition: 0.06233s;
        }
    }
</style>
