<script lang="ts">
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import type { GameData } from './game.js';

    export let game: GameData;

    let lastTime = new Date().getTime();
    let elapsedTime = 0;

    const ranking = {} as Record<number, { id: string; time: number }[]>;
    const scores = {} as Record<string, number>;

    $: {
        for (const id in game.players) {
            const player = game.players[id];
            let sum = 0;

            for (const question in player.answers) {
                const answers = player.answers[question];
                for (const key in Object.keys(answers)) {
                    const options = game.data.questions[question].options;
                    const correct = options[key].correct;
                    const time = game.times[question];
                    const gameTime = time.end - time.start;
                    sum += correct ? answers[key] - time.start : gameTime;
                }
            }
            scores[id] = sum;
        }
        const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]);
        for (const [i, [id, score]] of sorted.entries()) {
            ranking[i + 1] = ranking[i + 1] || [];
            ranking[i + 1].push({ id, time: score });
        }

        // test
        // new Array(10).fill(0).forEach((_, i) => {
        // 	ranking[i + 1] = ranking[i + 1] || [];
        // 	ranking[i + 1].push({ id: `player${Math.random()}`, time: Math.random() * 1000 });
        // 	ranking[i + 1].push({ id: `player${Math.random()}`, time: Math.random() * 1000 });
        // });
    }

    let handle: number;

    function updateTime() {
        const now = new Date().getTime();
        elapsedTime += now - lastTime;
        lastTime = now;
        handle = window.requestAnimationFrame(updateTime);
    }

    function resetTime() {
        elapsedTime = 0;
        lastTime = new Date().getTime();
        game = { ...game };
    }

    onMount(() => {
        handle = window.requestAnimationFrame(updateTime);
        return () => window.cancelAnimationFrame(handle);
    });

    const a = 100;

    let rankingRender = {} as Record<number, { id: string; index: number; time: number }[]>;

    $: {
        let i = 0;
        let toRender = elapsedTime / 100;
        rankingRender = {};
        for (const rank in ranking) {
            rankingRender[i] = [];
            for (const player of ranking[rank]) {
                toRender--;
                if (toRender <= 0) break;
                rankingRender[i].push({ ...player, index: i });
            }
            if (toRender <= 0) break;
            i++;
        }
    }
</script>

<div class="game-result">
    {#each Object.entries(rankingRender) as [rank, players], rankIndex (rankIndex)}
        <ul class="ranking" class:highlight={rankIndex === 0}>
            <li transition:fly={{ x: 40, duration: 400 }} class="rank">
                {rankIndex + 1}{rankIndex === 0 ? '位' : ''}
            </li>
            {#each players.sort((a, b) => a.time - b.time) as { id, index, time }, i (i)}
                <li
                    class="player"
                    transition:fly={{ x: 40, duration: 400 }}
                    style="opacity: {Math.max(0.25, 1 / (index * 4 + 1))};"
                >
                    <img
                        src={game.players[id].author.avatar_url}
                        alt={game.players[id].author.name}
                        class="avatar"
                    />
                    {id}
                    <small>
                        {Math.round(time / 10) / 100}秒
                    </small>
                </li>
            {/each}
        </ul>
    {/each}
</div>

<style lang="scss">
    .game-result {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: flex-start;
        height: 70%;
        margin-left: 2rem;
    }

    .ranking {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: flex-start;

        .rank {
            margin-top: 1rem;
            font-size: 1.5rem;
            font-weight: bold;
        }

        .player {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 0.5rem 0;
            margin-bottom: 0.5rem;
            font-size: 1rem;
            font-weight: bold;
            color: var(--color-1);
        }

        .avatar {
            width: 2rem;
            height: 2rem;
            margin-right: 1rem;
            border-radius: 50%;
        }

        small {
            display: flex;
            align-items: flex-end;
            height: 2rem;
            margin-left: 1rem;
            font-size: 1rem;
            font-weight: normal;
        }

        &.highlight {
            .rank {
                margin-top: 1rem;
                margin-bottom: 0.5rem;
                font-size: 1.5rem;
                font-weight: bold;
                color: var(--color-text);
            }

            .player {
                margin-bottom: 0.5rem;
                font-size: 2rem;
                font-weight: bold;
            }
        }
    }

    li {
        list-style: none;
    }
</style>
