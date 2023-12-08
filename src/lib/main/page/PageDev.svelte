<script lang="ts">
    import { App, models } from "@omuchat/client";
    import { onMount } from "svelte";

    import { getClient } from "$lib/common/omuchat/client";
    import { theme } from "$lib/common/theme";
    import { i18n } from "$lib/i18n/i18n-context";
    import { invoke } from "$lib/util/tauri";

    const { client, chat, server } = getClient();
    let text = `test-${Date.now()}`
    let authorName = `test-author-${Date.now()}`
    let authorIcon = `https://picsum.photos/seed/${Date.now()}/200/200`
    function send() {
        console.log(text);
        chat.messages!.add(new models.Message({
            room_id: "test",
            id: `test-${Date.now()}`,
            content: models.TextContent.of(text),
            author: new models.Author({
                id: "test",
                name: authorName,
                avatar_url: authorIcon,
            })
        }));
        text = `test-${Date.now()}`
        authorName = `test-author-${Date.now()}`
        authorIcon = `https://picsum.photos/seed/${Date.now()}/200/200`
    }
    function clear() {
        text = "";
    }
    let apps: Map<string, App> = new Map();

    onMount(() => {
        return server.apps.listen((chache) => {
            apps = chache;
        });
    });

    let starting = false;
    function start() {
        if (starting) return;
        starting = true;
        invoke('run_server').then((res) => {
            console.log(`run_server: ${res}`);
        }).finally(() => {
            starting = false;
        });
    }
    function delete_runtime() {
        invoke('delete_runtime').then((res) => {
            console.log(`delete_runtime: ${res}`);
        });
    }
</script>

<div class="container">
    <div class="section">
        <h3>Server</h3>
        <span>
            {client.connection.connected ? 'connected' : 'disconnected'}
            <small>
                {client.connection.address.host}:{client.connection.address.port}
            </small>
            <div>
                {starting ? 'starting' : 'stopped'}
                <button on:click={start}>
                    start
                </button>
                <button on:click={delete_runtime}>
                    delete runtime
                </button>
            </div>
        </span>
    </div>
    <div class="section">
        <h3>Message</h3>
        <div>
            <button on:click={send}>
                send
            </button>
            Message:
            <input type="text" bind:value={text} />
            Author:
            <input type="text" bind:value={authorName} />
            Icon:
            <input type="text" bind:value={authorIcon} />
            <button on:click={clear}>
                clear
            </button>
        </div>
    </div>
    <div class="section">
        <h3>Language</h3>
        <div>
            {$i18n?.locale}
        </div>
    </div>
    <div class="section">
        <h3>Apps</h3>
        <div>
            {#each Array.from(apps.values()) as app}
                <div>
                    {app.name}
                </div>
            {/each}
        </div>
    </div>
    <div class="section">
        <h3>Theme Color</h3>
        <div>
            {#each Object.entries($theme) as [key, value]}
                <div>
                    {key}: {value}
                    <input type="color" value={value} on:change={(e) => {
                        if (!e.target) return;
                        const value = e.target.value;
                        if (!value) return;
                        $theme = {
                            ...$theme,
                            [key]: value,
                        };
                    }} />
                </div>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow: auto;
        background: var(--color-bg-1);

        .section {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: fit-content;
            height: fit-content;
            padding: 10px;
            margin: 10px;
            background: var(--color-bg-2);
            outline: 1px solid var(--color-1);
        }
    }
</style>