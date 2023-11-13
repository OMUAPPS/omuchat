import type { PropedComponent } from "$lib/type/component";
import { writable, type Writable } from "svelte/store";

export interface Page {
    name: string;
    component(): PropedComponent;
}

export const pages: Writable<Record<string, Page>> = writable({});