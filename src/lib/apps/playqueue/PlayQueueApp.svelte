<script lang="ts">
    import { Client, events, models } from '@omuchat/client';
    import { App } from '@omuchat/omu.js';

    import InputText from '$lib/common/input/InputText.svelte';


    const app = new App({
        name: "play-queue",
        version: "0.1.0",
        group: "omu-apps",
    });
    const client = new Client({
        app,
    });

    client.chat.authors.listen();
    client.on(events.MessageCreate, async (message) => {
        if (!message.author_id) return;
        const regex = new RegExp(joinWord);
        if (regex.test(message.text)) {
            queue = [...queue, message];
        }
        console.log(await client.chat.authors.get(message.author_id));
    });

    let joinWord = '';
    let leaveWord = '';
    let queue: models.Message[] = [];
    
    client.run();
</script>

<main>
    <div class="header">
        <div class="title">
            <i class="ti ti-list" />
            <span>参加型管理</span>
        </div>
    </div>
    <div class="settings">
        <span>
            参加ワード
            <InputText bind:value={joinWord} />
        </span>
        <span>
            辞退ワード
            <InputText bind:value={leaveWord} />
        </span>
    </div>
    <div class="queue">
        {#each queue as item}
            <div class="item">
                {#if item.author_id}
                    {#await client.chat.authors.get(item.author_id) then author}
                    {#if author}
                        <img src={author.avatar_url} width="32" height="32" alt="" />
                        <span>{author.name}</span>
                    {/if}
                    {/await}
                {/if}
                {item.text}
            </div>
        {/each}
    </div>
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        margin: 10px;
        margin: 0;
        background: var(--color-bg-2);
    }

    .header {
        display: flex;
        flex-direction: row;
        gap: 40px;
        align-items: center;
        width: 100%;
        min-height: 80px;
        padding: 20px;
        background: var(--color-bg-2);
        border-bottom: 1px solid var(--color-1);

        .title {
            display: flex;
            flex-direction: row;
            gap: 10px;
            align-items: baseline;
            padding-left: 20px;
            font-size: 18px;
            font-weight: 600;
            color: var(--color-1);
        }
    }

    .settings {
        display: flex;
        flex-direction: row;
        gap: 100px;
        align-items: center;
        white-space: nowrap;
    }

    .queue {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        overflow-y: scroll;
    }

    .item {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
        width: 100%;
        white-space: nowrap;
    }
</style>