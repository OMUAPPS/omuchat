<script lang="ts">
    import QuestionEdit from './QuestionEdit.svelte';

    import type { Quiz } from '../quiz.js';
    import { deleteQuiz, screen, updateQuiz } from '../stores.js';

    export let quiz: Quiz;
    export let close: () => void;

    let changed = false;

    function addQuestion() {
        quiz.data.questions = [
            ...quiz.data.questions,
            {
                text: '',
                options: [{ key: '1', text: '', correct: false }],
                shuffle: true,
            },
        ];
        changed = true;
    }

    function save() {
        updateQuiz(quiz);
        changed = false;
    }

    function play() {
        $screen = 'game';
    }

    function remove() {
        deleteQuiz(quiz.id);
        close();
    }
</script>

<div class="quiz-edit">
    <h2>
        <small>タイトル</small>
        <input bind:value={quiz.data.title} on:input={() => (changed = true)} />
        <button on:click={changed ? save : play} class="save">
            {#if changed}
                保存
                <i class="ti ti-device-floppy" />
            {:else}
                遊ぶ
                <i class="ti ti-player-play" />
            {/if}
        </button>
        <button on:click={remove} class="remove-quiz">
            クイズを削除する
            <i class="ti ti-trash" />
        </button>
    </h2>
    <div class="questions">
        <span class="settings">
            <small>ランク決め方法</small>
            <select bind:value={quiz.data.sort} on:change={() => (changed = true)} class="sort">
                <option value="score"> スコア </option>
                <option value="time"> 時間 </option>
            </select>
            {#if quiz.data.sort === 'time'}
                <small>
                    コメントとのラグが大きい場合は、スコアでソートすることをお勧めします。
                </small>
            {/if}
        </span>
        {#each quiz.data.questions as question, i}
            <b>
                第{i + 1}問
                <button
                    on:click={() => {
                        quiz.data.questions = quiz.data.questions.filter((_, j) => i !== j);
                        changed = true;
                    }}
                    class="remove"
                >
                    <i class="ti ti-trash" />
                </button>
            </b>
            <div class="question">
                <QuestionEdit bind:question bind:changed />
            </div>
        {/each}
        <button on:click={addQuestion} class="add">
            新しい問題を追加
            <i class="ti ti-plus" />
        </button>
    </div>
</div>

<style lang="scss">
    .quiz-edit {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        height: 100%;
        padding: 1rem 2rem;
        background: var(--color-bg-2);
    }

    h2 {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
        padding-bottom: 1rem;
        font-size: 1.5rem;
        color: var(--color-1);
        border-bottom: 1px solid var(--color-bg-1);
    }

    small {
        font-size: 0.8rem;
        font-weight: bold;
        color: var(--color-1);
    }

    input {
        padding: 0.5rem 1rem;
        margin: 0;
        font-size: 1rem;
        font-weight: bold;
        color: var(--color-1);
        background: var(--color-bg-1);
        border: none;
        border-bottom: 2px solid var(--color-1);

        &:hover {
            outline: 1px solid var(--color-1);
            outline-offset: -4px;
        }
    }

    button {
        padding: 0.5rem 1rem;
        margin: 0;
        font-size: 1rem;
        font-weight: bold;
        color: var(--color-1);
        cursor: pointer;
        background: var(--color-bg-1);
        border: none;

        &:hover {
            color: var(--color-bg-1);
            background: var(--color-1);
        }
    }

    .save {
        color: var(--color-bg-1);
        background: var(--color-1);
    }

    .questions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow-y: auto;
    }

    .remove {
        width: 2rem;
        height: 2rem;
        padding: 0;
        margin-left: 0.5rem;
        border: none;
    }

    .settings {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
        margin-top: 1rem;
        margin-bottom: 2rem;
    }

    .sort {
        height: 2rem;
        padding: 0 1rem;
        margin: 0;
        font-size: 1rem;
        font-weight: bold;
        color: var(--color-1);
        background: var(--color-bg-1);
        border: none;
        border-bottom: 2px solid var(--color-1);
    }

    .question {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 1rem;
        margin-right: 1rem;
        background: var(--color-bg-1);
        border-left: 2px solid var(--color-1);
    }

    .add {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: baseline;
        align-self: flex-start;
        padding: 0.5rem 1rem;
        margin: 0;
        font-size: 1rem;
        font-weight: bold;
        color: var(--color-1);
        cursor: pointer;
        background: var(--color-bg-1);
        border: none;

        &:hover {
            outline: 1px solid var(--color-1);
            outline-offset: -4px;
        }
    }

    .remove-quiz {
        margin-left: auto;
    }
</style>
