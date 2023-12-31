<script lang="ts" generics="_T extends Keyable">
    import type { Keyable, Table } from '@omuchat/omu.js';
    import { onMount, type ComponentType, type SvelteComponent } from 'svelte';

    import { getClient } from './client';

    import VirtualList from '$lib/common/VirtualList.svelte';

    type T = _T & Keyable; // TODO: 後悔

    export let table: Table<T>;
    export let component: ComponentType<SvelteComponent<{ entry: T }>>;
    export let filter: (key: string, entry: T) => boolean = () => true;
    export let sort: (a: T, b: T) => number = () => 0;
    export let reverse: boolean = false;
    export let initial: number = 40;
    export let limit = 400;

    const { client } = getClient();
    let entries: Map<string, T> = new Map();
    let items: [string, T][] = [];
    let startIndex = 0;
    let endIndex = 0;
    let updated = false;
    let viewport: HTMLDivElement;
    let last: string | undefined;

    async function fetch() {
        if (!client.connection.connected) return;
        if (last) {
            const items = await table.fetch({
                cursor: last,
                before: initial
            });
            updateCache(items);
            update();
            return;
        }
        const items = await table.fetch({
            before: initial
        });
        updateCache(items);
        updated = false;
    }

    client.connection.addTask(async () => {
        entries.clear();
        fetch();
    });

    function updateCache(cache: Map<string, T>) {
        if (cache.size === 0) return;
        last = [...cache.entries()].pop()?.[0];
        let newItems = [...cache.entries()];
        if (filter) {
            newItems = newItems.filter(([key, entry]) => filter(key, entry));
        }
        if (newItems.length === 0) return;
        if (startIndex === 0) {
            entries = new Map([...entries.entries(), ...newItems].slice(-limit));
        } else {
            entries = new Map([...entries.entries(), ...newItems]);
        }
        updated = true;
        console.log(entries.size);
        return;
    }

    function handleScroll(e: Event) {
        const target = e.target as HTMLDivElement;
        const { scrollTop, scrollHeight, clientHeight } = target;
        if (scrollTop + clientHeight >= scrollHeight - 1000) {
            fetch();
        }
    }

    onMount(() => {
        table.listen((items) => {
            updateCache(items);
            updated = true;
        });
        table.addListener({
            onRemove(items) {
                for (const key of items.keys()) {
                    entries.delete(key);
                }
                updated = true;
            },
            onUpdate(items) {
                for (const [key, value] of items.entries()) {
                    if (filter && !filter(key, value)) {
                        entries.delete(key);
                        continue;
                    }
                    entries.set(key, value);
                }
                updated = true;
            }
        });
        viewport.addEventListener('scroll', handleScroll);

        return () => {
            viewport.removeEventListener('scroll', handleScroll);
        };
    });

    function top() {
        startIndex = 0;
        viewport.scrollTo({ top: 0 });
    }

    function update() {
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
        updated = false;
    }

    $: {
        if (!items.length || (startIndex === 0 && updated)) {
            update();
        }
    }
</script>

<div class="list">
    <div class="items">
        <VirtualList {items} bind:viewport bind:start={startIndex} bind:end={endIndex} let:item>
            <svelte:component this={component} entry={item} />
        </VirtualList>
    </div>
    {#if updated}
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
