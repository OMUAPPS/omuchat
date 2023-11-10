import type { PropedComponent } from "$lib/type/component";
import { getContext, setContext } from "svelte";
import type { Readable } from "svelte/motion";
import type { Writable } from "svelte/store";

export interface PanelEntry {
    icon: string;
    name: string;
    width?: number;
    fit?: boolean;
    component(): PropedComponent;
    element?: HTMLElement;
    dragging?: boolean;
    index?: Writable<number>;
}

export interface PanelContext {
    panels: Readable<PanelEntry[]>;
    addPanel(panel: PanelEntry): void;
    removePanel(panel: PanelEntry): void;
    swapPanel(from: PanelEntry, to: PanelEntry): void;
    updateDrag(panel: PanelEntry, x: number): void;
    dragPanel(panel: PanelEntry, x: number): void;
}

export const PANEL_CONTEXT = Symbol('panel-context');

export function setPanelContext(context: PanelContext) {
    return setContext(PANEL_CONTEXT, context);
}

export function getPanelContext(): PanelContext {
    return getContext(PANEL_CONTEXT);
}