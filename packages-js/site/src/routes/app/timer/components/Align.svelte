<script lang="ts">
    import type { AlignType } from '../timer-app.js';

    export let align: AlignType;

    $: vertical = {
        top: 'top',
        center: 'center',
        bottom: 'bottom',
    }[align.split('-')[0]];

    $: horizontal = {
        left: 'left',
        center: 'center',
        right: 'right',
    }[align.split('-')[1]];
</script>

<div class="container">
    <button
        on:click={() => (align = 'top-left')}
        class:selected={vertical === 'top' && horizontal === 'left'}
    >
        <i class="ti ti-box-align-top-left" />
    </button>
    <button
        on:click={() => (align = 'top-center')}
        class:selected={vertical === 'top' && horizontal === 'center'}
    >
        <i class="ti ti-box-align-top" />
    </button>
    <button
        on:click={() => (align = 'top-right')}
        class:selected={vertical === 'top' && horizontal === 'right'}
    >
        <i class="ti ti-box-align-top-right" />
    </button>
    <button
        on:click={() => (align = 'center-left')}
        class:selected={vertical === 'center' && horizontal === 'left'}
    >
        <i class="ti ti-box-align-left" />
    </button>
    <button
        on:click={() => (align = 'center-center')}
        class:selected={vertical === 'center' && horizontal === 'center'}
    >
        <i class="ti ti-box-margin" />
    </button>
    <button
        on:click={() => (align = 'center-right')}
        class:selected={vertical === 'center' && horizontal === 'right'}
    >
        <i class="ti ti-box-align-right" />
    </button>
    <button
        on:click={() => (align = 'bottom-left')}
        class:selected={vertical === 'bottom' && horizontal === 'left'}
    >
        <i class="ti ti-box-align-bottom-left" />
    </button>
    <button
        on:click={() => (align = 'bottom-center')}
        class:selected={vertical === 'bottom' && horizontal === 'center'}
    >
        <i class="ti ti-box-align-bottom" />
    </button>
    <button
        on:click={() => (align = 'bottom-right')}
        class:selected={vertical === 'bottom' && horizontal === 'right'}
    >
        <i class="ti ti-box-align-bottom-right" />
    </button>
</div>

<style lang="scss">
    .container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
    }

    .ti {
        font-size: 1rem;
    }

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        border: 1px solid var(--color-outline);
        background: transparent;
        cursor: pointer;

        &.selected {
            color: var(--color-bg-1);
            background: var(--color-1);
        }
    }
</style>
