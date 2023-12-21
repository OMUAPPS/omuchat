<script lang="ts" generics="_T extends Keyable">

    import type { Keyable, Table } from "@omuchat/omu.js";
    import { onMount, type ComponentType, type SvelteComponent } from "svelte";

    import { getClient } from "./client";

    import VirtualList from "$lib/common/VirtualList.svelte";

    type T = _T & Keyable; // TODO: 後悔

    export let table: Table<T>;
    export let component: ComponentType<SvelteComponent<{entry: T}>>;
    export let filter: (key: string, entry: T) => boolean = () => true;
    export let sort: (a: T, b: T) => number = () => 0;
    export let reverse: boolean = false;
    
    const { client } = getClient();
    let entries: Map<string, T> = new Map();
    let items: [string, T][] = [];
    let scroll = 0;
    let update = false;
    let viewport: HTMLDivElement;

    function fetch() {
        table.fetch(table.info.cacheSize ?? 100);
    }

    onMount(() => {
        client.connection.addListener({
            onConnect() {
                entries.clear();
                fetch();
            },
        });
        if (client.connection.connected) {
            fetch();
        }
        return table.listen((chache) => {
            update = true;
            if (filter) {
                chache = new Map([...chache.entries()].filter(([key, entry]) => filter(key, entry)));
                entries = new Map([...entries.entries(), ...chache.entries()].slice(-(table.info.cacheSize ?? 100)));
                return;
            }
            entries = chache;
        });
    });

    function top() {
        scroll = 0;
        viewport.scrollTo({ top: 0 });
    }

    $: {
        if (!items.length || scroll === 0 && update) {
            items = Array.from(entries.entries());
            if (filter) {
                items = items.filter(([key, entry]) => filter(key, entry));
            }
            if (sort) {
                items = items.sort(([, entryA], [, entryB]) => sort(entryA, entryB));
            }
            if (reverse) {
                items = items.reverse();
            }
            update = false;
        }
    }
</script>

<div class="list">
    <div class="items">
        <VirtualList
            items={items}
            bind:viewport={viewport}
            bind:start={scroll}
            let:item
        >
            <svelte:component this={component} entry={item} />
        </VirtualList>
    </div>
    {#if update}
        <button class="loading" on:click={top}>
            更新があります
            <i class="ti ti-chevron-up" />
        </button>
    {/if}
</div>

<style lang="scss">
    .list {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
    }

    .loading {
        position: absolute;
        top: 10px;
        right: 50%;
        display: flex;
        gap: 5px;
        align-items: baseline;
        justify-content: center;
        padding: 6px 10px;
        font-size: 12px;
        font-weight: 600;
        color: var(--color-1);
        background: var(--color-bg-1);
        border: none;
        border-radius: 50px;
        outline: 1px solid var(--color-1);
        transform: translateX(50%);

        i {
            font-size: 14px;
        }

        &:hover {
            outline: 2px solid var(--color-1);
        }
    }

    .items {
        width: 100%;
        height: 100%;
    }
</style>