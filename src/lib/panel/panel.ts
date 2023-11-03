import { getContext, setContext, type ComponentType } from "svelte";
import { writable, type Readable } from "svelte/store";

export interface Panel {
    name: string;
    component(): ComponentType;
}

export interface PanelContext {
    panels: Readable<Panel[]>;
    registerPanel(panel: Panel): void;
    unregisterPanel(panel: Panel): void;
    movePanel(panel: Panel, index: number): void;
}

export const PANEL_CONTEXT = Symbol('panel-context');

export function createPanelContext(): PanelContext {
    const panels = writable<Panel[]>([]);

    const context = {
        panels,
        registerPanel(panel: Panel) {
            panels.update((panels) => [...panels, panel]);
        },
        unregisterPanel(panel: Panel) {
            panels.update((panels) => panels.filter((p) => p !== panel));
        },
        movePanel(panel: Panel, index: number) {
            panels.update((panels) => {
                const i = panels.indexOf(panel);
                if (i === -1) return panels;
                panels.splice(i, 1);
                panels.splice(index, 0, panel);
                return panels;
            });
        },
    };
    setPanelContext(context);
    return context;
}

export function setPanelContext(context: PanelContext) {
    return setContext(PANEL_CONTEXT, context);
}

export function getPanelContext(): PanelContext {
    return getContext(PANEL_CONTEXT);
}