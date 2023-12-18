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
            if (filter) {
                chache = new Map([...chache.entries()].filter(([key, entry]) => filter(key, entry)));
                entries = new Map([...entries.entries(), ...chache.entries()].slice(-(table.info.cacheSize ?? 100)));
                return;
            }
            entries = chache;
        });
    });

    $: {
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
    }
</script>

<div class="list">
    <VirtualList
        items={items}
        let:item
    >
        <svelte:component this={component} entry={item} />
    </VirtualList>
</div>

<style lang="scss">
    .list {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
    }
</style>