<script lang="ts">
    import QuizList from './component/QuizList.svelte';
    import { createGame } from './game/game.js';
    import type { Quiz } from './quiz.js';
    import { screen } from './stores.js';

    let selected: Quiz | undefined;

    $: {
        if (selected) {
            screen.set('game');
            createGame(selected);
        }
    }
</script>

<div class="menu">
    <button on:click={() => ($screen = 'create')}>
        クイズを作る
        <i class="ti ti-pencil-plus" />
    </button>
    <div class="list">
        <div>
            <h3>作ったクイズを遊ぶ</h3>
            <QuizList bind:selected />
        </div>
    </div>
</div>

<style lang="scss">
    .menu {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: calc(min(40rem, 100vw) - 4rem);
        height: fit-content;
        min-height: 100px;
        overflow-y: auto;
    }

    button {
        width: fit-content;
        padding: 0.5rem 2rem;
        font-weight: bold;
        color: var(--color-bg-1);
        background: var(--color-1);
        border: 2px solid var(--color-1);
        outline: 2px solid var(--color-bg-1);
        outline-offset: -4px;
    }
</style>
