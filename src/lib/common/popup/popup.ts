import { SvelteComponent, getContext, setContext, type ComponentType } from 'svelte';
import { writable, type Readable } from 'svelte/store';

export interface Popup<Props extends Record<string, any> = any> {
    component: ComponentType<SvelteComponent<Props>>;
    props: Props;
}

export interface PopupContext {
    stack: Readable<Popup[]>;
    current: Readable<Popup | null>;
    push: (props: Popup) => void;
    pop: () => void;
}

export const POPUP_CONTEXT = Symbol('popup-context');

export function createPopupContext(): PopupContext {
    const stack = writable<Popup[]>([]);
    const current = writable<Popup | null>(null);

    const context = {
        stack,
        current,
        push(props: Popup) {
            stack.update((stack) => [...stack, props]);
            current.set(props);
        },
        pop() {
            stack.update((stack) => {
                const props = stack.pop();
                current.set(stack[stack.length - 1] || null);
                return stack;
            });
        },
    };
    setPopupContext(context);
    return context;
}

export function setPopupContext(context: PopupContext) {
    return setContext(POPUP_CONTEXT, context);
}

export function getPopupContext(): PopupContext {
    return getContext(POPUP_CONTEXT);
}
