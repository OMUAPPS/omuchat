<script lang="ts">
    import { events } from '@omuchatjs/chat';
    import ConnectingScreen from './ConnectingScreen.svelte';
    import Menu from './Menu.svelte';
    import { client } from './client.js';
    import CreateScreen from './create/CreateScreen.svelte';
    import GameScreen from './game/GameScreen.svelte';
    import { gameData, getQuizzes, screen } from './stores.js';
    import './styles.scss';

    client.on(events.Ready, () => {
        $screen = null;
        getQuizzes().then((quizzes) => {
            console.log(quizzes);
            if (!Object.keys(quizzes).length) {
                $screen = 'create';
            }
        });
    });
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
    {#if $screen}
        <button on:click={() => ($screen = null)} class="close">
            <i class="ti ti-arrow-left" />
            戻る
        </button>
    {/if}
    {#if $screen === 'connecting'}
        <ConnectingScreen />
    {:else if $screen === 'create'}
        <CreateScreen />
    {:else if $screen === 'game' && $gameData}
        <GameScreen />
    {:else}
        <Menu />
    {/if}
</section>

<style lang="scss">
    section {
        position: fixed;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
        background: var(--color-bg-1);
    }

    .close {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0.5rem 1rem;
        margin: 2rem;
        font-size: 1rem;
        font-weight: bold;
        color: var(--color-1);
        cursor: pointer;
        background: var(--color-bg-2);
        border: none;

        &:hover {
            outline: 2px solid var(--color-1);
            outline-offset: -4px;
        }

        &:active {
            color: var(--color-bg-2);
            background: var(--color-1);
        }
    }
</style>
