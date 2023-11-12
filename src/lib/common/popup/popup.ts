import type { PropedComponent } from '$lib/type/component';
import { writable } from 'svelte/store';


const stack = writable<PropedComponent[]>([]);
const current = writable<PropedComponent | null>(null);

function push(props: PropedComponent) {
    stack.update((stack) => [...stack, props]);
    current.set(props);
}

function pop() {
    stack.update((stack) => {
        stack.pop();
        current.set(stack[stack.length - 1] || null);
        return stack;
    });
}

export const popupContext = {
    push,
    pop,
    current,
    stack,
};