<script lang="ts">
    export let placeholder: string = '';
    export let disabled: boolean = false;
    export let readonly: boolean = false;
    export let value: string = '';
    let tempValue: string = value;
    let timer: any | null = null;

    function handleChange(event: Event) {
        tempValue = (event.target as HTMLInputElement).value;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            value = tempValue;
        }, 500);
        console.log(value);
    }

    function exit() {
        if (timer) {
            clearTimeout(timer);
        }
        value = tempValue;
    }
</script>

<input
    class="input"
    type="text"
    {placeholder}
    value={tempValue}
    {disabled}
    {readonly}
    on:input={handleChange}
    on:blur={exit}
/>

<style lang="scss">
    .input {
        width: 100%;
        height: 40px;
        padding: 0 10px;
        margin: 10px 0;
        background: var(--color-bg-1);
        border: 1px solid var(--color-1);
        border-radius: 5px;

        &:focus {
            background: var(--color-bg-1);
        }

        &:hover {
            outline: 1px solid var(--color-1);
        }

        &:disabled {
            color: var(--color-2);
            background: var(--color-bg-2);
        }

        &:read-only {
            color: var(--color-2);
            background: var(--color-bg-2);
        }

        &::placeholder {
            color: var(--color-1);
        }
    }
</style>
