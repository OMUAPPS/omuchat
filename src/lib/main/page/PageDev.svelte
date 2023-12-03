<script lang="ts">
    import { App, models } from "@omuchat/client";
    import { onMount } from "svelte";

    import { layoutInvert } from "../settings";

    import { getClient } from "$lib/common/omuchat/client";
    import { i18n } from "$lib/i18n/i18n-context";

    const { chat, server } = getClient();
    let text = "";
    let authorName = "";
    let authorIcon = "";
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
</script>

<div class="container" class:invert={$layoutInvert}>
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

    .invert {
        align-items: flex-end;
    }
</style>