<script lang="ts">
    import { gameData, screen } from '../stores.js';
    import Game from './Game.svelte';
    import { updateGame } from './game.js';
</script>

{#if $gameData}
    {#if $gameData.status === 'waiting'}
        <h1>
            {$gameData?.data.title}
        </h1>
        <span class="buttons">
            <button
                on:click={() => {
                    updateGame((game) => ({
                        ...game,
                        times: {
                            ...game.times,
                            [0]: {
                                start: new Date().getTime(),
                                end: 0,
                            },
                        },
                        status: 'playing',
                    }));
                }}
            >
                スタート
                <i class="ti ti-player-play" />
            </button>
            <button
                on:click={() => {
                    $screen = 'create';
                }}
            >
                編集する
                <i class="ti ti-pencil-plus" />
            </button>
        </span>
    {:else}
        <div class="game-screen">
            <Game game={$gameData} />
        </div>
    {/if}
{/if}

<style lang="scss">
    .game-screen {
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

    h1 {
        font-size: 2rem;
        font-weight: bold;
        color: var(--color-1);
    }

    .buttons {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;

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
    }
</style>
