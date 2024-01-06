import type { ChatExtension } from '@omuchat/client/chat/index.js';
import type { Client } from '@omuchat/omu.js';
import type { ServerExtension } from '@omuchat/omu.js/extension/server/index.js';
import { getContext, setContext } from 'svelte';

import type { DashboardExtension } from './dashboard-ext.js';

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
