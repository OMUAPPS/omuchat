<script lang="ts">
    import type { QuestionOption } from '../quiz.js';
    import { screen } from '../stores.js';
    import GameResult from './GameResult.svelte';
    import { next, type GameData } from './game.js';

    export let game: GameData;

    let options: [number, QuestionOption][] = [];

    $: {
        const question = game.data.questions[game.currentQuestion];
        options = [...question.options.entries()];
        if (question.shuffle) {
            options = options.sort(() => Math.random() - 0.5);
        }
        console.log(options);
    }
</script>

{#if game.status === 'playing'}
    <h1>Playing</h1>
    {@const question = game.data.questions[game.currentQuestion]}
    <p>{question.text}</p>
    {#each options as [i, option]}
        <p>
            {option.text}
            <small>
                {#each Object.entries(game.players).filter(([, player]) => i in (player.answers[game.currentQuestion] || {})) as [id, player]}
                    {id}
                    {player.answers[game.currentQuestion][i]}ms
                {/each}
            </small>
        </p>
    {/each}
    <button on:click={next}>次へ</button>
{:else if game.status === 'finished'}
    <GameResult {game} />
    <button on:click={() => ($screen = null)} class="back">
        <i class="ti ti-arrow-left" />
        戻る
    </button>
{/if}

<style lang="scss">
    .back {
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
