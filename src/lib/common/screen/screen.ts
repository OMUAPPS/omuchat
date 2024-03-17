import { get, writable } from 'svelte/store';

import type { TypedComponent } from '$lib/common/component/proped-component.js';


export type ScreenHandle = {
    id: number;
    pop: () => void;
};

export type ScreenComponentType<T> = TypedComponent<{
    screen: ScreenHandle;
    props?: T;
}>;

export interface ScreenComponent<T> {
    id: number;
    component: ScreenComponentType<T>;
    props: T;
};

let id = 0;
const stack = writable<Map<number, ScreenComponent<unknown>>>(new Map());
const current = writable<ScreenComponent<unknown> | null>(null);

function push<T>(component: ScreenComponentType<T>, props: T) {
    if (get(current)?.component === component) {
        return;
    }
    stack.update((stack) => {
        const newId = id++;
        stack.set(newId, {
            id: newId,
            component: component as ScreenComponentType<unknown>,
            props
        });
        const last = Array.from(stack.values()).pop() || null;
        current.set(last);
        return stack;
    });

}

function pop(id: number) {
    stack.update((stack) => {
        stack.delete(id);
        const last = Array.from(stack.values()).pop() || null;
        current.set(last);
        return stack;
    });
}

export const screenContext = {
    push,
    pop,
    current,
    stack,
};
