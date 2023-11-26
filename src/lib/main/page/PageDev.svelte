<script lang="ts">
    import { App, Message, TextContent } from "@omuchat/client";
    import { onMount } from "svelte";

    import { getClient } from "$lib/common/omuchat/client";
    import { i18n } from "$lib/i18n/i18n-context";

    const { chat, server } = getClient();
    let text = "";
    function send() {
        console.log(text);
        chat.messages!.add(new Message({
            room_id: "test",
            id: `test-${Date.now()}`,
            content: TextContent.of(text),
        }));
    }
    function clear() {
        text = "";
    }
    let apps: Map<string, App> = new Map();

    function updateApps(cache: Map<string, App>) {
        apps = cache;
    }

    onMount(() => {
        const listener = {
            onCacheUpdate(cache: Map<string, App>) {
                updateApps(cache);
            },
        }
        server.apps.fetch(100);
        server.apps.addListener(listener);
        return () => {
            server.apps.removeListener(listener);
        }
    });
</script>

<div class="container">
    <div class="section">
        <h3>Message</h3>
        <div>
            <button on:click={send}>
                send
            </button>
            <input type="text" bind:value={text} />
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
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
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