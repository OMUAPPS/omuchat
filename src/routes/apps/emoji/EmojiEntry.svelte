<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import type { Emoji } from "./emoji";

    import Button from "$lib/common/input/Button.svelte";
    import Tooltip from "$lib/common/tooltip/Tooltip.svelte";

    const dispatch = createEventDispatcher();

    export let emoji: Emoji;

    function copyName() {
        navigator.clipboard.writeText(emoji.name);
    }

    function copyRegex() {
        navigator.clipboard.writeText(emoji.regex);
    }
    
    function deleteEmoji() {
        dispatch('delete', emoji);
    }

    function editEmoji() {
        dispatch('edit', emoji);
    }

    function testEmoji() {
        dispatch('test', emoji);
    }
</script>

<div class="emoji-entry">
    <span>
        <Tooltip>
            <img src={emoji.image_url} alt={emoji.name} class="preview" />
        </Tooltip>
        <img src={emoji.image_url} alt={emoji.name} />
    </span>
    <div class="info">
        <button class="name" on:click={copyName}>
            <Tooltip>
                クリックでコピー
            </Tooltip>
            {emoji.name}
            <i class="ti ti-copy" />
        </button>
        <button class="regex" on:click={copyRegex}>
            <Tooltip>
                クリックでコピー
            </Tooltip>
            {emoji.regex}
            <i class="ti ti-copy" />
        </button>
    </div>
    <div class="buttons">
        <Button on:click={testEmoji}>
            <Tooltip>
                テスト
            </Tooltip>
            <i class="ti ti-send" />
        </Button>
        <Button on:click={editEmoji}>
            <Tooltip>
                編集
            </Tooltip>
            <i class="ti ti-pencil" />
        </Button>
        <Button on:click={deleteEmoji}>
            <Tooltip>
                削除
            </Tooltip>
            <i class="ti ti-trash" />
        </Button>
    </div>
</div>

<style lang="scss">
    .emoji-entry {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        padding: 10px;
        background: var(--color-bg-2);

        .preview {
            height: auto;
            max-height: 128px;
        }

        .buttons {
            display: none;
        }

        img {
            height: 50px;
            object-fit: contain;
            margin-right: 10px;
        }

        .info {
            display: flex;
            flex: 1;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            margin-right: 10px;
            margin-left: 5px;

            .name {
                font-size: 1em;
                font-weight: bold;
            }

            .regex {
                font-size: 0.7em;
                color: color-mix(in srgb, var(--color-text) 80%, transparent 0%);
            }
        }

        &:hover {
            outline: 2px solid var(--color-1);

            .buttons {
                display: flex;
            }
        }
    }

    button {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
        color: var(--color-text);
        cursor: pointer;
        background: none;
        border: none;

        i {
            display: none;
        }

        &:hover {
            color: var(--color-1);

            i {
                display: block;
            }
        }
    }
</style>
