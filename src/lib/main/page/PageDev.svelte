<script lang="ts">
    import { Message, TextContent } from "@omuchat/client";

    import { getClient } from "$lib/common/omuchat/client";

    const { chat } = getClient();
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
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        gap: 10px;
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