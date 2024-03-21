import { writable, type Writable } from 'svelte/store';

import type { TypedComponent } from '$lib/common/typed-component.js';

export interface Page<T extends Record<string, never> = Record<string, never>> {
    name: string;
    component: TypedComponent<T>;
    props: T;
}

export const pages: Writable<Map<string, Page>> = writable(new Map());
