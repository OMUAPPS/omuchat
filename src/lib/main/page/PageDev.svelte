<script lang="ts">
  
    let text = "";
    function send() {
        console.log(text);
        text = "";
    }
</script>

<div class="container">
    <div class="section">
        <button on:click={send}>
            send
        </button>
        <input type="text" bind:value={text} />
    </div>
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        height: 100%;
        background: var(--color-bg-1);

        .section {
            width: fit-content;
            height: fit-content;
            padding: 10px;
            margin: 10px;
            background: var(--color-bg-2);
            outline: 1px solid var(--color-1);
        }
    }
</style>