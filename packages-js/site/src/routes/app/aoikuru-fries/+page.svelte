<script lang="ts">
    import { Flat, property as p } from '@omujs/flat';
    import MainScene, { MAIN_SCENE } from './MainScene.svelte';
    import { DEBUG } from './stores.js';
    import { BROWSER } from 'esm-env';

    const flat = new Flat({
        scenes: {
            main: MAIN_SCENE,
        },
    });

    let dataText: string = (BROWSER && localStorage.getItem('data')) || '';
    if (dataText) {
        const data = new Uint8Array(Array.from(window.atob(dataText), (c) => c.charCodeAt(0)));
        flat.deserialize(data);
    }
    let refreshKey: number = 0;
</script>

<main>
    {#key refreshKey}
        <MainScene scene={MAIN_SCENE} />
    {/key}
</main>
<div class="controls">
    <button
        on:click={() => {
            const data = flat.serialize();
            const b64encoded = window.btoa(String.fromCharCode(...data));
            console.log(b64encoded);
            dataText = b64encoded;
            localStorage.setItem('data', b64encoded);
        }}
    >
        save
    </button>
    <button
        on:click={() => {
            refreshKey++;
            const data = new Uint8Array(Array.from(window.atob(dataText), (c) => c.charCodeAt(0)));
            flat.deserialize(data);
        }}
    >
        load
    </button>
    <button
        on:click={() => {
            refreshKey++;
        }}
    >
        reset
    </button>
    {$DEBUG}
    <button
        on:click={() => {
            $DEBUG = !$DEBUG;
        }}
    >
        toggle debug
    </button>
    <input type="text" bind:value={dataText} />
</div>

<style lang="scss">
    main {
        position: absolute;
        top: 0;
        left: 0;
        width: calc(1920px);
        height: calc(1080px);
        scale: 1;
        transform-origin: 0 0;
        background: #fff;
    }

    .controls {
        position: fixed;
        top: 0;
        right: 0;
        padding: 1rem;
        background: white;
        border: 1px solid black;
    }
</style>
