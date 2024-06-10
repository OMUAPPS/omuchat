<script lang="ts">
    export let x: number;
    export let y: number;
    let offsetX = 0;
    let offsetY = 0;
</script>

<div
    style="left: {x}px; top: {y}px;"
    draggable="true"
    role="article"
    on:dragstart={(e) => {
        offsetX = e.clientX - x;
        offsetY = e.clientY - y;
    }}
    on:drag={(e) => {
        x = e.clientX - offsetX;
        y = e.clientY - offsetY;
    }}
    on:dragend={(e) => {
        x = e.clientX - offsetX;
        y = e.clientY - offsetY;
    }}
>
</div>

<style>
    div {
        position: absolute;
        width: 20px;
        height: 20px;
        background: red;
        border-radius: 50%;
        transform: translate(-50%, -50%);
    }
</style>
