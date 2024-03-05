import type { Client as ChatClient } from '@omuchatjs/chat';
import type { Client as OmuClient } from '@omuchatjs/omu';
import { getContext, setContext } from 'svelte';
import type { Dashboard } from './dashboard.js';

export const CLIENT_CONTEXT = Symbol('client-context');

interface ClientContext {
    chat: ChatClient;
    client: OmuClient;
    dashboard: Dashboard;
}

export function setClient(context: ClientContext) {
    return setContext<ClientContext>(CLIENT_CONTEXT, context);
}

export function getClient(): ClientContext {
    return getContext<ClientContext>(CLIENT_CONTEXT);
}
