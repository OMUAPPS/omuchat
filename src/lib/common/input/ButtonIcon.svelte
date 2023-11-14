<script>
    export let callback = () => {};
</script>

<button class="button" type="button" on:click={callback}>
    <slot />
</button>

<style lang="scss">
    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        font-size: 16px;
        color: var(--color-1);
        background: transparent;
        border: none;
        outline: none;

        &:hover {
            color: var(--color-bg-2);
            background: var(--color-1);
        }
    }
</style>
