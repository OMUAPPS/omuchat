<script lang="ts" generics="_T">
    import { onMount, tick } from 'svelte';

    type T = [string, _T];

    // props
    export let items: T[] = [];

    export let height = '100%';
    export let itemHeight: number | undefined = undefined;

    // read-only, but visible to consumers via bind:start
    export let start = 0;
    export let end = 0;
    export let viewport: HTMLDivElement;

    // local state
    let height_map: number[] = [];
    let rows: HTMLElement[];
    let contents: HTMLDivElement;
    let viewport_height = 0;
    let visible: { index: number, data: T }[];
    let mounted: boolean;

    let top = 0;
    let bottom = 0;
    let average_height: number;
    let first = true;

    $: visible = items.slice(start, end).map((data, i) => {
        return { index: i + start, data };
    });

    // whenever `items` changes, invalidate the current heightmap
    $: if (mounted) refresh(items, viewport_height, itemHeight);

    async function refresh(items: T[], viewport_height: number, itemHeight: number | undefined) {
        if (first) {
            first = false;
            // render first 3 rows
            end = Math.min(3, items.length);
            await tick();
            let average_height = 0;
            for (let i = 0; i < end; i += 1) {
                average_height += height_map[i] = itemHeight || rows[i].offsetHeight;
            }
            average_height /= end;
            height_map = new Array(items.length).fill(average_height);
        }
        const { scrollTop } = viewport;

        await tick(); // wait until the DOM is up to date

        let content_height = top - scrollTop;
        let i = start;

        while (content_height <= viewport_height && i < items.length) {
            let row = rows[i - start];

            if (!row) {
                end = i + 1;
                await tick(); // render the newly visible row
                row = rows[i - start];
            }

            const row_height = height_map[i] = itemHeight || height_map[i] || row.offsetHeight;
            content_height += row_height;
            i += 1;
        }

        end = i;

        const remaining = items.length - end;
        average_height = (top + content_height) / end;

        bottom = remaining * average_height;
        height_map.length = items.length;
    }

    async function handle_scroll() {
        const { scrollTop } = viewport;

        for (let v = 0; v < rows.length; v += 1) {
            height_map[start + v] = itemHeight || rows[v].offsetHeight;
        }

        let i = 0;
        let y = 0;

        while (i < items.length) {
            const row_height = height_map[i] || average_height;
            if (y + row_height > scrollTop) {
                start = i;
                top = y;

                break;
            }

            y += row_height;
            i += 1;
        }

        while (i < items.length) {
            y += height_map[i] || average_height;
            i += 1;

            if (y > scrollTop + viewport_height) break;
        }

        end = i;

        const remaining = items.length - end;
        average_height = y / end;

        while (i < items.length) height_map[i++] = average_height;
        bottom = remaining * average_height;

        // TODO if we overestimated the space these
        // rows would occupy we may need to add some
        // more. maybe we can just call handle_scroll again?
    }

    // trigger initial refresh
    onMount(() => {
        rows = contents.getElementsByTagName('svelte-virtual-list-row');
        mounted = true;
    });
</script>

<svelte-virtual-list-viewport
    bind:this={viewport}
    bind:offsetHeight={viewport_height}
    on:scroll={handle_scroll}
    style="height: {height};"
>
    <svelte-virtual-list-contents
        bind:this={contents}
        style="padding-top: {top}px; padding-bottom: {bottom}px;"
    >
        {#each visible as row (row.data[0])}
            <svelte-virtual-list-row>
                <slot item={row.data[1]}>Missing template</slot>
            </svelte-virtual-list-row>
        {/each}
    </svelte-virtual-list-contents>
</svelte-virtual-list-viewport>

<style>
    svelte-virtual-list-viewport {
        position: relative;
        display: block;
        overflow-y: auto;
        -webkit-overflow-scrolling:touch;
    }

    svelte-virtual-list-contents, svelte-virtual-list-row {
        display: block;
    }

    svelte-virtual-list-row {
        overflow: hidden;
    }
</style>