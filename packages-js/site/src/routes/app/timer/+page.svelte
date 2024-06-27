<script lang="ts">
    import { page } from '$app/stores';
    import AppPage from '$lib/components/AppPage.svelte';
    import { Omu } from '@omujs/omu';
    import { AppHeader, DragLink, setClient, Textbox } from '@omujs/ui';
    import { BROWSER } from 'esm-env';
    import { APP } from './app.js';
    import { TimerApp } from './timer-app.js';
    import Timer from './components/Timer.svelte';

    const omu = new Omu(APP);
    const timer = new TimerApp(omu);
    const { data, config } = timer;
    setClient(omu);

    if (BROWSER) {
        omu.start();
    }
</script>

<AppPage>
    <header slot="header">
        <AppHeader app={APP} />
    </header>
    <main>
        <h3>操作</h3>
        <section>
            <button on:click={() => timer.toggle()}>
                {#if $data.running}
                    停止
                    <i class="ti ti-player-pause" />
                {:else}
                    開始
                    <i class="ti ti-player-play" />
                {/if}
            </button>
            <button on:click={() => timer.reset()}>
                リセット
                <i class="ti ti-reload" />
            </button>
            <Textbox bind:value={$config.format} />
        </section>
        <h3>タイム</h3>
        <section>
            <Timer {timer} />
        </section>

        <h3>OBSに貼り付ける</h3>
        <section>
            {#if BROWSER}
                <DragLink
                    href={() => {
                        const url = new URL($page.url);
                        url.pathname = `${url.pathname}asset`;
                        url.searchParams.set('assetId', Date.now().toString());
                        return url;
                    }}
                >
                    <h3 slot="preview" class="drag-preview">
                        これをOBSにドロップ
                        <i class="ti ti-upload" />
                    </h3>
                    <div class="drag">
                        <i class="ti ti-drag-drop" />
                        ここをOBSにドラッグ&ドロップ
                    </div>
                </DragLink>
            {/if}
        </section>
    </main>
</AppPage>

<style lang="scss">
    main {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: flex-start;
        width: 100%;
        height: 100vh;
        padding: 40px;
    }

    .drag-preview {
        padding: 10px 20px;
        background: var(--color-bg-2);
    }

    .drag {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: var(--color-1);
        background: var(--color-bg-2);
        outline: 2px solid var(--color-1);
        padding: 10px;
        gap: 5px;
        cursor: grab;

        & > i {
            font-size: 20px;
        }

        &:hover {
            margin-left: 4px;
            outline: 2px solid var(--color-1);
            box-shadow: -4px 4px 0 2px var(--color-2);
            transition: 0.06233s;
        }
    }

    h3 {
        color: var(--color-1);
        margin-bottom: 10px;
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 0.75rem;
        font-weight: bold;
        color: var(--color-1);
        background: var(--color-bg-2);
        border: 2px solid var(--color-1);
        cursor: pointer;
        gap: 5px;

        &:hover {
            background: var(--color-1);
            color: var(--color-bg-2);
        }

        & > i {
            font-size: 20px;
        }
    }

    section {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: start;
        justify-content: flex-start;
        width: 100%;
        padding: 0px;
        margin-bottom: 20px;
    }
</style>
