<script lang="ts">
    import Tooltip from '$lib/components/Tooltip.svelte';
    import type { QuestionOption } from '../quiz.js';

    export let option: QuestionOption;
    export let placeholder: string;
    export let action: () => void;
    export let changed: boolean;
</script>

<div class="option-edit">
    <button
        class="check"
        class:correct={option.correct}
        on:click={() => {
            option.correct = !option.correct;
            changed = true;
        }}
    >
        <Tooltip>{option.correct ? '正解' : '不正解'}</Tooltip>
        <i class="ti ti-{option.correct ? 'circle' : 'x'}" />
    </button>
    <span class="text">
        <Tooltip>選択肢</Tooltip>
        <input bind:value={option.text} on:input={() => (changed = true)} {placeholder} />
    </span>
    <span class="text key">
        <Tooltip>反応する文字</Tooltip>
        <input bind:value={option.key} on:input={() => (changed = true)} placeholder="文字" />
    </span>
    <button on:click={action} class="action">
        <i class="ti ti-trash" />
        <Tooltip>削除</Tooltip>
    </button>
</div>

<style lang="scss">
    .option-edit {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        width: 100%;
        padding: 0.5rem;
        background: var(--color-bg-1);
    }

    button {
        padding: 0;
        margin: 0;
        cursor: pointer;
        background: none;
        border: none;
    }

    input {
        width: 100%;
        height: 2rem;
        padding: 0.5rem;
        margin: 0;
        font-size: 1rem;
        border: none;
        border-bottom: 2px solid var(--color-1);
    }

    .text {
        flex: 1;
    }

    .key {
        flex: 0.3;
        width: 4rem;
    }

    .check {
        width: 2rem;
        height: 2rem;
        color: var(--color-bg-1);
        background: #ccc;

        &.correct {
            background: var(--color-1);
        }

        &:hover {
            outline: 2px solid var(--color-bg-1);
            outline-offset: -4px;
        }
    }

    .action {
        width: 2rem;
        height: 2rem;
        color: var(--color-1);
        background: var(--color-bg-2);

        &:hover {
            background: var(--color-bg-1);
        }
    }
</style>
