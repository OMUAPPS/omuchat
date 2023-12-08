<script lang="ts" generics="_T extends Keyable">
    import type { Keyable, Table } from "@omuchat/omu.js";
    import { onMount, type ComponentType, type SvelteComponent } from "svelte";

    type T = _T & Keyable;

    export let table: Table<T>;
    export let component: ComponentType<SvelteComponent<{entry: T}>>;

    let entries: Map<string, T> = new Map();

    onMount(() => {
        return table.listen((chache) => {
            entries = chache;
        });
    });
</script>

{#each entries.entries() as [key, item] (key)}
    <div class="item">
        <svelte:component this={component} entry={item} />
    </div>
{/each}