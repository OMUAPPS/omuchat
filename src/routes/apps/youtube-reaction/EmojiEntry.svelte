<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let key: string;
    export let value: string | undefined;

    const dispatcher = createEventDispatcher();

    function editValue(event: Event) {
        dispatcher("edit", [key, (event.target as HTMLInputElement).value]);
    }
</script>

<div class="entry">
    <div class="key">
        {key}
    </div>
    <i class="ti ti-arrow-right" />
    <div class="value">
        {#if value}
            <img src={value} alt="" />
        {:else}
            未設定
        {/if}
    </div>
</div>
<input type="text" bind:value={value} on:input={editValue} placeholder="画像URL" />

<style lang="scss">
    @import 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap';
    @import 'https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap';

    .entry {
        display: flex;
        align-items: center;
        margin: 10px 0;
        font-family: 'Noto Sans JP', sans-serif;
        font-size: 1.5rem;

        .key {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            font-family: 'Noto Color Emoji', 'Noto Sans JP', sans-serif;
            font-size: 2rem;
            text-align: center;
        }

        .value {
            flex: 1;
            margin-left: 20px;
            
            img {
                width: 100px;
                height: 100px;
            }
        }
    }
    input {
        width: 100%;
        font-size: 0.8rem;
    }
</style>