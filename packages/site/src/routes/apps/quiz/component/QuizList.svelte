<script lang="ts">
    import QuizEntry from './QuizEntry.svelte';

    import type { Quiz } from '../quiz.js';
    import { deleteQuiz, quizzes } from '../stores.js';

    export let selected: Quiz | undefined = undefined;
</script>

<div class="quiz-list">
    {#each Object.entries($quizzes ?? {}).reverse() as [id, data] (id)}
        <button on:click={() => (selected = { id, data })}>
            <QuizEntry quiz={data} selected={selected?.id === id} remove={() => deleteQuiz(id)} />
        </button>
    {/each}
</div>

<style lang="scss">
    .quiz-list {
        display: flex;
        flex-flow: row wrap;
        gap: 1rem;
        width: 100%;
        height: fit-content;
        min-height: 100px;
        padding: 1rem 0;
        overflow-y: auto;
    }

    button {
        padding: 0;
        margin: 0;
        cursor: pointer;
        background: none;
        border: none;
    }
</style>
