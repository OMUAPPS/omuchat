<script lang="ts">
    import { models } from '@omuchatjs/chat';

    import AppEntry from './AppEntry.svelte';

    import { getClient } from '$lib/common/omuchat/client.js';
    import { theme } from '$lib/common/theme/theme.js';
    import { i18n } from '$lib/i18n/i18n-context.js';
    import { invoke } from '$lib/utils/tauri.js';
    import { TableList } from '@omuchatjs/ui';

    const { client, chat } = getClient();
    let text = `test-${Date.now()}`;
    let authorName = `test-author-${Date.now()}`;
    let authorIcon = `https://picsum.photos/seed/${Date.now()}/200/200`;
    function send() {
        console.log(text);
        const author = new models.Author({
            provider_id: 'test',
            id: 'test',
            name: authorName,
            avatar_url: authorIcon,
        });
        chat.authors.add(author);
        chat.messages.add(
            new models.Message({
                room_id: 'test',
                id: `test-${Date.now()}`,
                content: models.content.Text.of(text),
                author_id: author.key(),
                created_at: new Date(),
            }),
        );
    }
    function clear() {
        text = '';
    }

    let starting = false;
    function start() {
        if (starting) return;
        starting = true;
        invoke('run_server')
            .then((res) => {
                console.log(`run_server: ${res}`);
            })
            .finally(() => {
                starting = false;
            });
    }

    function delete_runtime() {
        invoke('delete_runtime').then((res) => {
            console.log(`delete_runtime: ${res}`);
        });
    }

    function install_runtime() {
        invoke('install_runtime').then((res) => {
            console.log(`install_runtime: ${res}`);
        });
    }

    function update_libraries() {
        invoke('update_libraries').then((res) => {
            console.log(`update_libraries: ${res}`);
        });
    }

    function clearSettings() {
        window.localStorage.clear();
    }
</script>

<div class="container">
    <div class="section">
        <h3>Server</h3>
        <span>
            {client.network.connected ? 'connected' : 'disconnected'}
            <small>
                {client.network.address.host}:{client.network.address.port}
            </small>
            <div>
                {starting ? 'starting' : 'stopped'}
                <button on:click={start}> start </button>
                <button
                    on:click={() => {
                        client.server.shutdown();
                    }}
                >
                    stop
                </button>
                <button
                    on:click={() => {
                        client.server.printTasks();
                    }}>print tasks</button
                >
                <button on:click={delete_runtime}>delete runtime</button>
                <button on:click={install_runtime}>install runtime</button>
                <button on:click={update_libraries}>update libraries</button>
                <button on:click={clearSettings}>clear settings</button>
            </div>
        </span>
    </div>
    <div class="section">
        <h3>Language</h3>
        <div>
            {$i18n?.locale}
        </div>
    </div>
    <div class="section">
        <h3>Message</h3>
        <div>
            <button on:click={send}> send </button>
            Message:
            <input type="text" bind:value={text} />
            Author:
            <input type="text" bind:value={authorName} />
            Icon:
            <input type="text" bind:value={authorIcon} />
            <button on:click={clear}> clear </button>
        </div>
    </div>
    <div class="section">
        <h3>Apps</h3>
        <div class="apps">
            <TableList table={client.server.apps} component={AppEntry} />
        </div>
    </div>
    <div class="section">
        <h3>Theme Color</h3>
        <div>
            {#each Object.entries($theme) as [key, value]}
                <div>
                    {key}: {value}
                    <input
                        type="color"
                        {value}
                        on:change={(e) => {
                            if (!e.currentTarget) return;
                            const value = e.currentTarget.value;
                            if (!value) return;
                            $theme = {
                                ...$theme,
                                [key]: value,
                            };
                        }}
                    />
                </div>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-flow: column;
        width: 100%;
        height: 100%;
        padding: 10px;
        overflow: auto;
        background: var(--color-bg-1);

        .section {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
            height: fit-content;
            padding: 10px;
            margin-bottom: 10px;
            background: var(--color-bg-2);
            outline: 1px solid var(--color-1);
        }

        .apps {
            height: fit-content;
        }
    }
</style>
