<script lang="ts">
    import { get, writable, type Writable } from 'svelte/store';

    import { setPanelContext, type PanelContext, type PanelEntry } from './panel';
    import Panel from './Panel.svelte';

    export let panels: Writable<PanelEntry[]> = writable([]);

    const selected = writable<PanelEntry | null>(null);
    const context: PanelContext = {
        panels,
        addPanel(panel: PanelEntry) {
            panels.update((panels) => [...panels, panel]);
        },
        removePanel(panel: PanelEntry) {
            panels.update((panels) => panels.filter((p) => p !== panel));
        },
        swapPanel(from: PanelEntry, to: PanelEntry) {
            if (!from.index) return;
            if (!to.index) return;
            const temp = get(from.index);
            from.index.set(get(to.index));
            to.index.set(temp);
        },
        updateDrag(panel: PanelEntry) {
            const rectFrom = panel.element!.getBoundingClientRect();
            for (const p of $panels) {
                if (p === panel) continue;
                const rectTo = p.element!.getBoundingClientRect();
                if (rectFrom.right > rectTo.left && rectFrom.left < rectTo.right) {
                    $selected = p;
                    return;
                }
            }
            $selected = null;
        },
        dragPanel(panel: PanelEntry) {
            if (!$selected) return;
            this.swapPanel(panel, $selected);
            $selected = null;
        }
    };
    setPanelContext(context);

    $: $panels.forEach((p, i) => (p.index = writable(i)));
</script>

<div class="container">
    {#each $panels as panel}
        <Panel {panel} selected={$selected === panel} />
    {/each}
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        gap: 10px;
        width: 100%;
        height: 100%;
        padding: 10px;
        overflow-x: scroll;
        background: var(--color-bg-1);
    }
</style>
