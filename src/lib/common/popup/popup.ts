import { getContext, setContext, type ComponentType } from 'svelte';

export interface PopupProps {
    component: ComponentType;
    props?: any;
}

export interface PopupContext {
    push: (props: PopupProps) => void;
    pop: () => void;
}

export const POPUP_CONTEXT = Symbol('popup-context');

export function setPopupContext(context: PopupContext) {
    return setContext(POPUP_CONTEXT, context);
}

export function getPopupContext(): PopupContext {
    return getContext(POPUP_CONTEXT);
}
