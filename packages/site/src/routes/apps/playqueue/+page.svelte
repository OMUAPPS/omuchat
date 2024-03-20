<script lang="ts">
    import { Client, events } from '@omuchatjs/chat';
    import { App } from '@omuchatjs/omu';

    import { browser } from '$app/environment';
    import PlayQueueEntry from './PlayQueueEntry.svelte';
    import { identifier } from './app.js';
    import type { Entry } from './playqueue.js';

    const app = App.fromIdentifier(identifier, {
        version: '0.1.0',
    });
    const client = new Client({
        app,
    });

    client.authors.listen();
    client.on(events.MessageCreate, async (message) => {
        if (!active) return;
        if (!message.authorId) return;
        const regex = new RegExp(joinWord);
        if (regex.test(message.text)) {
            const author = await client.authors.get(message.authorId);
            if (!author) return;
            entries = [
                ...entries,
                {
                    author,
                    message,
                    element: null,
                },
            ];
        }
    });

    let active: boolean = false;
    let settingOpen: boolean = false;
    let joinWord = '参加';
    let leaveWord = '辞退';
    let entries: Entry[] = [];

    if (browser) {
        client.run();
    }
</script>

<main>
    <div class="header">
        <span class="top">
            <div class="title">
                <i class="ti ti-list" />
                <span>参加型管理</span>
            </div>
            <div class="actions">
                <button on:click={() => (settingOpen = !settingOpen)}>
                    {#if settingOpen}
                        設定を閉じる
                    {:else}
                        設定を編集
                        <i class="ti ti-chevron-down" />
                    {/if}
                </button>
                <div class="action">
                    <span>
                        {active ? `終了する` : `開始する`}
                    </span>
                    <button class="toggle" on:click={() => (active = !active)} class:active>
                        <i class="ti ti-check" />
                    </button>
                </div>
            </div>
        </span>
    </div>
    {#if settingOpen}
        <div class="settings">
            <span class="setting">
                <i class="ti ti-arrow-down-right" />
                参加ワード
                <input type="text" bind:value={joinWord} />
            </span>
            <span class="setting">
                <i class="ti ti-arrow-up-right" />
                辞退ワード
                <input type="text" bind:value={leaveWord} />
            </span>
        </div>
    {:else}
        <div class="description">
            <div>
                <span>
                    {joinWord}
                </span>
                で参加
                <span>
                    {leaveWord}
                </span>
                で辞退
            </div>
        </div>
    {/if}
    <div class="entries">
        {#each entries as entry}
            <PlayQueueEntry {entry} />
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

            .actions {
                display: flex;
                flex-direction: row;
                gap: 20px;
                align-items: center;
                margin-left: auto;

                .action {
                    display: flex;
                    flex-direction: row;
                    gap: 10px;
                    align-items: center;
                }

                .toggle {
                    display: flex;
                    flex-direction: row;
                    gap: 10px;
                    align-items: center;
                    justify-content: center;
                    width: 30px;
                    height: 30px;
                    color: transparent;
                    background: var(--color-bg-1);
                    border: 1px solid var(--color-1);
                    border-radius: 5px;
                    outline: none;

                    &:hover {
                        outline: 1px solid var(--color-1);
                    }

                    &.active {
                        color: var(--color-bg-1);
                        background: var(--color-1);
                    }

                    i {
                        font-size: 14px;
                    }
                }
            }
        }
    }

    .description {
        padding: 20px 40px;
        font-size: 12px;
        font-weight: 500;
        color: var(--color-1);
        background: var(--color-bg-1);

        div {
            display: flex;
            flex-direction: row;
            gap: 10px;
            align-items: baseline;
            width: fit-content;
            padding: 4px 8px 4px 2px;
        }

        span {
            display: flex;
            flex-direction: row;
            gap: 10px;
            align-items: center;
            padding: 5px 10px;
            font-size: 14px;
            font-weight: bold;
            color: var(--color-1);
            background: var(--color-bg-2);
        }
    }

    .settings {
        display: flex;
        flex-direction: row wrap;
        gap: 20px;
        align-items: center;
        width: 100%;
        height: 100px;
        padding: 10px 40px;
        white-space: nowrap;
        border-bottom: 1px solid var(--color-1);

        .setting {
            display: flex;
            flex-direction: row;
            gap: 10px;
            align-items: center;
            min-width: 200px;
            font-weight: 500;
            color: var(--color-1);
        }
    }

    .entries {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 10px 0;
        overflow-y: auto;
        background: var(--color-bg-1);
    }
</style>
