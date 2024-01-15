<script lang="ts">
    import type { Writable } from 'svelte/store';

    import { t } from '$lib/i18n/i18n-context.js';

    export let label: string;
    export let value: Writable<boolean>;
    export let disabled: boolean = false;

    function toggle() {
        $value = !$value;
    }
</script>

<label class="toggle">
    <span class="toggle-label">{$t(label)}</span>
    <input type="checkbox" bind:checked={$value} {disabled} on:click={toggle} />
    {#if $value}
        <i class="toggle-icon ti ti-check" />
    {/if}
</label>

<style lang="scss">
    .toggle {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 10px;
        cursor: pointer;
        user-select: none;

        input {
            width: 20px;
            height: 20px;
            appearance: none;
            background: var(--color-bg-2);
            border: none;
            border-radius: 5px;
            outline: 1px solid var(--color-1);

            &:checked {
                background: var(--color-1);
                outline: none;
            }
        }

        .toggle-icon {
            position: absolute;
            right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            color: var(--color-bg-2);
        }
    }
</style>
