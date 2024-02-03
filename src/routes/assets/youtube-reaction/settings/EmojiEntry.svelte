<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import { client } from "./youtube-reaction.js";

    import FileInput from "$lib/common/input/FileInput.svelte";
    import Tooltip from "$lib/common/tooltip/Tooltip.svelte";

    export let key: string;
    export let value: string | undefined;
    
    const dispatcher = createEventDispatcher();

    function editValue(event: Event) {
        dispatcher("edit", [key, (event.target as HTMLInputElement).value]);
    }

    async function handle(files: Map<string, Uint8Array>) {
        const [file] = files.values();
        if (!file) return;
        const [url] = await client.omu.assets.upload({
            key: `youtube-reaction/${key}.png`,
            buffer: file
        });
        dispatcher("edit", [key, `${client.omu.asset(url)}&${Date.now()}`]);
    }
</script>

<div class="entry">
    <span class="top">
        <div class="key">
            {key}
        </div>
        <i class="ti ti-arrow-right" />
        <div class="value">
            {#if value}
                <img src={value} alt="" />
            {:else}
                <i class="missing ti ti-file-unknown" />
            {/if}
        </div>
    </span>
    <span class="settings">
        <FileInput accept="image/*" {handle}>
            <button>
                <i class="ti ti-upload" />
                <Tooltip>
                    画像をアップロード
                </Tooltip>
            </button>
        </FileInput>
        <input type="text" bind:value={value} on:input={editValue} placeholder="画像URL" />
    </span>
</div>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');

    .entry {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 10px 0;
        font-family: 'Noto Sans JP', sans-serif;
        font-size: 1.5rem;
        background: var(--color-bg-2);

        span {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 100%;
            background: var(--color-bg-2);
        }

        .top {
            padding: 10px;
        }

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
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            img {
                width: 42px;
            }
            
            .missing {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 60px;
                height: 60px;
                font-size: 2rem;
                color: var(--color-1);
                opacity: 0.5;
            }
        }

        .settings {
            input {
                width: 100%;
                height: 40px;
                padding: 0 10px;
                margin-left: 1px;
                font-size: 0.8rem;
                color: var(--color-text);
                background: var(--color-bg-1);
                border: 1px solid var(--color-1);
                outline: none;
            }
        
            button {
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                font-size: 1rem;
                color: var(--color-bg-1);
                cursor: pointer;
                background: var(--color-1);
                border: 1px solid var(--color-1);
                outline: none;
        
                &:hover {
                    color: var(--color-1);
                    background: var(--color-bg-2);
                }
            }
        }
    }
</style>