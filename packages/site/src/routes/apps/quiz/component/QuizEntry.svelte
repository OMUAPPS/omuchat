<script lang="ts">
    import type { QuizData } from '../quiz.js';

    export let quiz: QuizData;
    export let selected: boolean;
    export let remove: () => void;
</script>

<div class:selected>
    <h3>
        {quiz.title}
    </h3>
    <button on:click={remove}>
        <i class="ti ti-trash" />
    </button>
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 300px;
        padding: 1rem;
        background: var(--color-bg-2);

        &:hover {
            outline: 2px solid;
            outline-color: var(--color-1);
            outline-offset: -5px;
        }

        button {
            display: none;
            width: 2rem;
            height: 2rem;
            padding: 0;
            margin: 0;
            color: var(--color-bg-2);
            cursor: pointer;
            background: none;
            border: none;

            &:hover {
                color: var(--color-1);
                background: var(--color-bg-2);
            }
        }

        &.selected {
            color: var(--color-bg-2);
            background: var(--color-1);
            outline-color: var(--color-bg-2);

            button {
                display: block;
            }
        }
    }
</style>
