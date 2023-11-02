import type { OmuChat } from '@omuchat/client';
import { getContext, setContext } from 'svelte';


export const OMUCHAT_CONTEXT = Symbol('omuchat-context');

export function setClient(context: OmuChat) {
    return setContext(OMUCHAT_CONTEXT, context);
}

export function getClient(): OmuChat {
    return getContext(OMUCHAT_CONTEXT);
}
