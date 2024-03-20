<script lang="ts">
    import Tooltip from '$lib/components/Tooltip.svelte';
    import type { Question } from '../quiz.js';
    import OptionEdit from './OptionEdit.svelte';

    export let question: Question;
    export let changed: boolean;

    function addOption() {
        const options = question.options;
        const key = (options.length + 1).toString();
        question.options = [...options, { key, text: '', correct: false }];
        changed = true;
    }
</script>

<div class="question-edit">
    <span class="question">
        <i class="ti ti-letter-q question-icon" />
        <input
            bind:value={question.text}
            on:input={() => (changed = true)}
            class="question-input"
            placeholder="問題文"
        />
        <span class="shuffle-container">
            <small> クイズ時に選択肢をシャッフル </small>
            <button
                on:click={() => {
                    question.shuffle = !question.shuffle;
                    changed = true;
                }}
                class="shuffle"
                class:active={question.shuffle}
            >
                <Tooltip>
                    {question.shuffle ? 'シャッフルする' : 'シャッフルしない'}
                </Tooltip>
                <i class="ti ti-{question.shuffle ? 'arrows-shuffle' : 'arrows-right'}" />
            </button>
        </span>
    </span>

    <il class="options">
        {#each question.options as option, j}
            <li>
                <OptionEdit
                    bind:option
                    bind:changed
                    placeholder={`選択肢${j + 1}`}
                    action={() => {
                        const options = question.options;
                        question.options = options.filter((_, k) => j !== k);
                        changed = true;
                    }}
                />
            </li>
        {/each}
        <button on:click={addOption} class="add">
            選択肢を追加
            <i class="ti ti-plus" />
        </button>
    </il>
</div>

<style lang="scss">
    .question-edit {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 40rem;
    }

    .question {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .question-icon {
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        width: 2rem;
        height: 2rem;
        padding: 0.3rem;
        font-size: 1rem;
    }

    .shuffle-container {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        margin-left: 1rem;
        font-weight: bold;
    }

    .shuffle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        padding: 0.3rem;
        font-size: 1rem;
        color: var(--color-1);
        cursor: pointer;
        background: var(--color-bg-2);
        border: none;
        border: 1px solid var(--color-1);

        &.active {
            color: var(--color-bg-2);
            background: var(--color-1);
            border: 1px solid var(--color-1);
        }
    }

    .options {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .add {
        align-self: flex-start;
        width: fit-content;
        padding: 0.5rem 1rem;
        margin-top: 1rem;
        font-weight: bold;
        color: var(--color-1);
        cursor: pointer;
        background: var(--color-bg-2);
        border: none;
        outline: 1px solid var(--color-1);
    }

    li {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
    }

    input {
        height: 2rem;
        margin: 0;
    }
</style>
