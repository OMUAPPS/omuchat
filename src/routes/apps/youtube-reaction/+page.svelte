<script lang="ts">
    import { Client } from '@omuchat/client';
    import { App } from '@omuchat/omu.js';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    import EmojiEntry from './EmojiEntry.svelte';

    
    const app = new App({
        name: "youtube-reaction",
        version: "0.1.0",
        group: "omu-apps",
    });
    const client = new Client({
        app,
    });

    let emojis: Map<string, string | undefined> = new Map();
    client.omu.registry.listen<Record<string, string | undefined>>({ name: 'emojis' }, (data) => {
        emojis = new Map([
            ['❤', undefined],
            ['💯', undefined],
            ['😳', undefined],
            ['🎉', undefined],
            ['😄', undefined],
            ...Object.entries(data || {}),
        ])
    });

    function editEmoji(event: CustomEvent<[string, string | undefined]>) {
        const [key, value] = event.detail;
        emojis.set(key, value);
        client.omu.registry.set({ name: 'emojis' }, Object.fromEntries(emojis));
    }

    let scale = writable(1);
    client.omu.registry.listen<number>({ name: 'scale' }, (data) => {
        scale.set(data || 1);
    });

    onMount(() => {
        scale.subscribe((value) => {
            if (!client.omu.connection.connected) return;
            client.omu.registry.set({ name: 'scale' }, value);
        });
    });


    client.omu.message.register({ name: 'test' });
    function test() {
        client.omu.message.broadcast({
            name: "test",
        }, {});
    }

    client.run();
</script>

<main>
    <div class="header">
        <span class="top">
            <div class="title">
                <i class="ti ti-heart" />
                リアクションオーバーレイ
            </div>
            <button on:click={test}>テスト</button>
        </span>
    </div>
    <div class="entries">
        <span>
            サイズ
            {$scale}
        </span>
        <input type="range" min="0.5" max="2" step="0.1" bind:value={$scale} />
        {#each emojis.entries() as [key, value] (key)}
            <EmojiEntry {key} {value} on:edit={editEmoji} />
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
        flex-direction: column;
        gap: 40px;
        align-items: center;
        width: 100%;
        min-height: 80px;
        background: var(--color-bg-2);
        border-bottom: 1px solid var(--color-1);

        .top {
            display: flex;
            flex-direction: row;
            gap: 40px;
            align-items: center;
            width: 100%;
            padding: 20px 40px;

            .title {
                display: flex;
                flex-direction: row;
                gap: 10px;
                align-items: baseline;
                font-size: 18px;
                font-weight: 600;
                color: var(--color-1);
            }
        }
    }

    .entries {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        height: 100%;
        padding: 20px;
        overflow: auto;
        background: var(--color-bg-1);
    }
</style>