import type { ChatExtension } from '@omuchat/client/src/chat';
import type { Client, ServerExtension } from '@omuchat/omu.js';
import { getContext, setContext } from 'svelte';

import type { DashboardExtension } from './dashboard-ext';

export const CLIENT_CONTEXT = Symbol('client-context');

interface ClientContext {
    client: Client;
    chat: ChatExtension;
    server: ServerExtension;
    dashboard: DashboardExtension;
}

export function setClient(context: ClientContext) {
    return setContext<ClientContext>(CLIENT_CONTEXT, context);
}

export function getClient(): ClientContext {
    return getContext<ClientContext>(CLIENT_CONTEXT);
}
