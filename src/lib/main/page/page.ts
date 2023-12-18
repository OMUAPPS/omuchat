import { writable, type Writable } from 'svelte/store';

import type { PropedComponent } from '$lib/common/component/proped-component';

export interface Page {
    name: string;
    component(): PropedComponent;
}

export const pages: Writable<Map<string, Page>> = writable(new Map());
