import type { ChatExtension } from '@omuchatjs/chat/chat/index.js';
import type { Client } from '@omuchatjs/omu';
import type { ServerExtension } from '@omuchatjs/omu/extension/server/index.js';
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
