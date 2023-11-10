import type { PropedComponent } from "$lib/type/component";
import { writable, type Writable } from "svelte/store";

export interface Page {
    title: string;
    icon: string;
    component(): PropedComponent;
}

export const pages: Writable<Page[]> = writable([]);
export const currentPage: Writable<Page | null> = writable(null);