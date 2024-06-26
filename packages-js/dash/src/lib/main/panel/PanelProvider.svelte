<script lang="ts">
    import { get, writable, type Writable } from 'svelte/store';

    import { setPanelContext, type PanelContext, type PanelEntry } from './panel.js';
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
            if (panel.element === undefined) return;
            const rectFrom = panel.element.getBoundingClientRect();
            for (const other of $panels) {
                if (other === panel) continue;
                if (other.element === undefined) return;
                const rectTo = other.element.getBoundingClientRect();
                if (rectFrom.right > rectTo.left && rectFrom.left < rectTo.right) {
                    $selected = other;
                    return;
                }
            }
            $selected = null;
        },
        dragPanel(panel: PanelEntry) {
            if (!$selected) return;
            this.swapPanel(panel, $selected);
            $selected = null;
        },
    };
    setPanelContext(context);

    $: $panels.forEach((p, i) => (p.index = writable(i)));
</script>

<div class="container">
    {#each $panels as panel (panel.name)}
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
        padding: 5px 15px 10px 15px;
        overflow-x: auto;
        background: var(--color-bg-1);
    }
</style>
