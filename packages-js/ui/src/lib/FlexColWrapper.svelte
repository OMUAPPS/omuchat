<script lang="ts">
    export let between = false;
    export let reverse = false;
    export let widthFull = false;
    export let heightFull = false;
    export let center = false;
    export let gap = false;
</script>

<div
    class:between
    class:reverse
    class:width={widthFull}
    class:height={heightFull}
    class:center
    class:gap
>
    <slot />
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .between {
        justify-content: space-between;
    }

    .reverse {
        flex-direction: column-reverse;
    }

    .width {
        width: 100%;
    }

    .height {
        height: 100%;
    }

    .center {
        align-items: center;
    }

    .gap {
        gap: 10px;
    }
</style>
