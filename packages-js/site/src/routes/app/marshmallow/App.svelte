<script lang="ts">
    import AppPage from '$lib/components/AppPage.svelte';
    import { AppHeader, Tooltip } from '@omujs/ui';
    import Popup from '../caption/Popup.svelte';
    import { APP } from './app.js';
    import SelectUser from './components/SelectUser.svelte';
    import { MarshmallowApp, type Message, type User } from './marshmallow-app.js';
    import Account from './components/Account.svelte';
    import AccountSwitcher from './components/AccountSwitcher.svelte';
    import MessageView from './components/MessageView.svelte';

    export let marshmallow: MarshmallowApp;
    const { config } = marshmallow;

    let user: User | null = null;
    let users: Record<string, User> | null = null;

    marshmallow.refreshUsers().then((res) => {
        users = res;
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
    let message: Message | null = null;

    $: {
        if (user) {
            marshmallow.getMessages(user.name).then((res) => {
                console.log(res);
                messages = res;
            });
        }
    }
</script>

<main>
    <div class="left">
        <AccountSwitcher {users} bind:user />
        <div class="messages">
            {#each messages as item}
                <button class="message" on:click={() => (message = item)}>
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
            {#if message}
                <button on:click={() => (message = null)} class="message hide">
                    <Tooltip>
                        クリックでメッセージを非表示
                        <i class="ti ti-chevron-right" />
                    </Tooltip>
                    <p>メッセージを非表示</p>
                    <i class="ti ti-x" />
                </button>
            {/if}
        </div>
    </div>
    <div class="right">
        {#if message}
            <MessageView {message} />
        {:else}
            メッセージを選択してください。
            <small> メッセージを選択すると、メッセージの詳細を表示できます。 </small>
        {/if}
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
</style>
