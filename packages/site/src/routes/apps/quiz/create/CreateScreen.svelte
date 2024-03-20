<script lang="ts">
    import { onMount } from 'svelte';
    import QuizList from '../component/QuizList.svelte';
    import type { Quiz, QuizData } from '../quiz.js';
    import { createQuiz, getQuizzes, quizzes } from '../stores.js';
    import QuizEdit from './QuizEdit.svelte';

    export let quiz: Quiz | undefined = undefined;

    async function create() {
        const data: QuizData = {
            title: '新しいクイズ',
            questions: [
                {
                    text: '新しい問題',
                    options: [
                        { key: '1', text: '選択肢1', correct: true },
                        { key: '2', text: '選択肢2', correct: false },
                        { key: '3', text: '選択肢3', correct: false },
                        { key: '4', text: '選択肢4', correct: false },
                    ],
                    shuffle: true,
                },
            ],
            sort: 'score',
        };
        quiz = await createQuiz(data);
    }

    onMount(() => {
        getQuizzes().then((quizzes) => {
            if (!Object.keys(quizzes).length) {
                create();
            }
        });
    });
</script>

<div class="quiz-create">
    {#if quiz}
        <div class="edit">
            <QuizEdit bind:quiz close={() => (quiz = undefined)} />
        </div>
    {:else}
        <button on:click={create}>
            新しいクイズを作成
            <i class="ti ti-plus" />
        </button>
        {#if $quizzes}
            <div>
                <h3>作ったクイズを編集する</h3>
                <QuizList bind:selected={quiz} />
            </div>
        {/if}
    {/if}
</div>

<style lang="scss">
    .quiz-create {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        width: calc(min(80rem, 100vw) - 4rem);
        height: calc(100vh - 8rem);
        margin-top: 4rem;
    }

    .edit {
        height: 100%;
    }

    button {
        width: fit-content;
        padding: 0.5rem 1rem;
        margin: 0;
        font-size: 1rem;
        font-weight: bold;
        color: var(--color-1);
        cursor: pointer;
        background: var(--color-bg-2);
        border: none;
        outline: 1px solid var(--color-1);

        &:hover {
            color: var(--color-bg-2);
            background: var(--color-1);
        }
    }
</style>
