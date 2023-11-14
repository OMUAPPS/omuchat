<script lang="ts">
    export let callback: () => void = () => {};
    export let outline = false;
    export let disabled = false;
</script>

<button class="button" type="button" on:click={callback} class:outline {disabled}>
    <slot />
</button>

<style lang="scss">
    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 30px;
        min-height: 30px;
        padding-right: 6px;
        padding-left: 6px;
        font-size: 16px;
        background: transparent;
        border: none;
        border-radius: 6px;
        outline: none;

        &:hover {
            color: var(--color-bg-2);
            background: var(--color-1);
            outline: 2px solid #fff;
        }

        &:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }
    }

    .outline {
        border: 1px solid var(--color-1);
    }
</style>
