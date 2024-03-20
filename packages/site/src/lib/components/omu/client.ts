import type { Client } from '@omuchatjs/omu';
import { getContext, setContext } from 'svelte';

export const CLIENT_CONTEXT = Symbol('client-context');


export function setClient(context: Client) {
    return setContext<Client>(CLIENT_CONTEXT, context);
}

export function getClient(): Client {
    return getContext<Client>(CLIENT_CONTEXT);
}
