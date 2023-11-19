import type { ChatExtension, Client } from '@omuchat/client';
import { getContext, setContext } from 'svelte';

export const CLIENT_CONTEXT = Symbol('client-context');

interface ClientContext {
    client: Client;
    chat: ChatExtension;
}

export function setClient(context: ClientContext) {
    return setContext<ClientContext>(CLIENT_CONTEXT, context);
}

export function getClient(): ClientContext {
    return getContext<ClientContext>(CLIENT_CONTEXT);
}
