<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";

    import type { Entry } from "./playqueue.js";

    import Button from "$lib/common/input/Button.svelte";
    import Tooltip from "$lib/common/tooltip/Tooltip.svelte";

    export let entry: Entry;

    const dispatcher = createEventDispatcher();

    let dragging = false;
    let offset = { x: 0, y: 0 };

    function handleMouseMove(event: MouseEvent) {
        if (dragging) {
            entry.element!.style.top = `${event.clientY - offset.y}px`;
            dispatcher("drag", entry);
        }
    }

    function handleMouseDown(event: MouseEvent) {
        dragging = true;
        offset = {
            x: event.clientX - entry.element!.clientLeft,
            y: event.clientY - entry.element!.clientTop,
        };
        handleMouseMove(event);
    }
    
    function handleMouseUp() {
        if (!dragging) return;
        dragging = false;
        dispatcher("drop", entry);
    }

    onMount(() => {
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    });
</script>

<div class="container">
    <div class="entry" bind:this={entry.element} class:dragging={dragging}>
        <button class="grab" on:mousedown={handleMouseDown} on:mouseup={handleMouseUp}>
            <i class="ti ti-grip-vertical" />
        </button>
        <div class="author">
            <img src={entry.author.avatar_url} width="32" height="32" alt="" />
            <span>{entry.author.name}</span>
        </div>
        <span class="buttons">
            <Button>
                <Tooltip>
                    <span>ブロック</span>
                </Tooltip>
                <i class="ti ti-user-off" />
            </Button>
            <Button>
                <Tooltip>
                    <span>拒否</span>
                </Tooltip>
                <i class="ti ti-x" />
            </Button>
            <Button>
                <Tooltip>
                    <span>参加</span>
                </Tooltip>
                <i class="ti ti-check" />
            </Button>
        </span>
    </div>
</div>

<style lang="scss">
    .entry {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: calc(100% - 20px);
        height: 60px;
        padding: 0;
        margin: 5px 10px;
        white-space: nowrap;
        background: var(--color-bg-2);

        img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }

        .grab {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 25px;
            height: 100%;
            cursor: grab;
            visibility: hidden;
            background: transparent;
            border: none;
            outline: none;

            &:hover {
                background: var(--color-bg-2);
            }
        }

        .author {
            display: flex;
            flex-direction: row;
            gap: 10px;
            align-items: center;
        }

        .buttons {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-right: 10px;
            margin-left: auto;
            color: var(--color-1);
            visibility: hidden;
        }

        &:hover {
            background: var(--color-bg-1);
            outline: 2px solid var(--color-1);
            transition: 0.06s;

            .buttons {
                visibility: visible;
            }

            .grab {
                visibility: visible;
            }
        }
    }
</style>