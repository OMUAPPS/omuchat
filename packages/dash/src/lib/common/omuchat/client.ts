import type { Chat } from '@omuchatjs/chat';
import type { Client as OmuClient } from '@omuchatjs/omu';
import { chat, client } from '@omuchatjs/ui';
import { getContext, setContext } from 'svelte';
import type { Dashboard } from './dashboard.js';

export const CLIENT_CONTEXT = Symbol('client-context');

interface ClientContext {
    chat: Chat;
    client: OmuClient;
    dashboard: Dashboard;
}

export function setClient(context: ClientContext) {
    client.set(context.client);
    chat.set(context.chat);
    return setContext<ClientContext>(CLIENT_CONTEXT, context);
}

export function getClient(): ClientContext {
    return getContext<ClientContext>(CLIENT_CONTEXT);
}
