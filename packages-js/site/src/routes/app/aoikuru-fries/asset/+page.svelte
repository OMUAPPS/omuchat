<script lang="ts">
    import { page } from '$app/stores';
    import '@fontsource/rocknroll-one';
    import { App, Omu } from '@omujs/omu';
    import { setClient } from '@omujs/ui';
    import { BROWSER } from 'esm-env';
    import { IDENTIFIER } from '../app.js';
    import { FriesApp } from '../fries-app.js';
    import { frame, type ThrowData } from '../state.js';
    import Avatar from './Avatar.svelte';
    import Board from './Board.svelte';
    import Fries from './Fries.svelte';
    import bg from './img/bg.png';
    import { Chat, events } from '@omujs/chat';

    let assetId = BROWSER && $page.url.searchParams.get('assetId');
    const id = assetId || Date.now().toString();
    const ASSET_APP = new App(IDENTIFIER.join('asset', id), {
        version: '0.1.0',
    });
    const omu = new Omu(ASSET_APP);
    const chat = new Chat(omu);
    const friesApp = new FriesApp(omu);
    const { config, state } = friesApp;
    setClient(omu);

    let queue: ThrowData[] = [];

    function processQueue() {
        if ($state.type !== 'idle') return;
        const data = queue.shift();
        if (!data) return;
        $state = {
            type: 'throw_start',
            thrower: data.thrower,
        };
    }

    state.subscribe((v) => {
        processQueue();
    });

    chat.on(events.message.add, async (message) => {
        if (!message.authorId) return;
        const author = await chat.authors.get(message.authorId.key());
        queue.push({
            thrower: author?.name || '',
        });
        processQueue();
    });

    friesApp.testSignal.listen((v) => {
        queue.push({
            thrower: `test${Date.now() % 1000}`,
        });
        processQueue();
    });

    chat.messages.listen();

    if (BROWSER) {
        omu.start();
    }
</script>

<main>
    <img src={bg} alt="" />
    <Board title={$config.text} />
    <Avatar {state} />
    <Fries {state} />

    {#if $config.hint}
        <small class="hint">
            {$config.hint}
        </small>
    {/if}
</main>
<div class="debug">
    {JSON.stringify($state)}
    {$frame}
</div>

<style lang="scss">
    main {
        position: fixed;
        inset: 0;
    }

    .debug {
        position: fixed;
        top: 0;
        left: 0;
        padding: 10px;
        background: #000;
        color: #fff;
    }

    img {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .hint {
        position: absolute;
        bottom: 24px;
        right: calc(27px * 2);
        font-size: 40px;
        padding: 5px 10px;
        background: #fefdfc;
        color: #77544b;
        font-family: 'RocknRoll One', sans-serif;
    }

    :global(body) {
        background: transparent !important;
    }
</style>
