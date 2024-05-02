import { setClient } from '@omuchatjs/ui';
import { Dashboard } from './dashboard.js';

import type { Address } from '@omuchatjs/omu/network/address.js';

import { App, Client, permissions } from '@omuchatjs/chat';


import { invoke, IS_TAURI } from '$lib/utils/tauri.js';
import { BrowserTokenProvider } from '@omuchatjs/chat/client.js';

import { DASHBOARD_OPEN_APP_PERMISSION_ID } from '@omuchatjs/omu/extension/dashboard/dashboard-extension.js';
import { Identifier } from '@omuchatjs/omu/identifier.js';
import { setChat } from '../../../../../ui/dist/stores.js';

const IDENTIFIER = new Identifier('cc.omuchat', 'dashboard');
const app = new App(IDENTIFIER, {
    version: '0.1.0',
});

const address = {
    host: window.location.hostname,
    port: 26423,
    secure: false,
};

class TokenProvider extends BrowserTokenProvider {
    async get(serverAddress: Address, app: App): Promise<string | undefined> {
        if (IS_TAURI) {
            const token = await invoke('get_token');
            if (token) {
                return token;
            }
        }
        return super.get(serverAddress, app);
    }

    async set(serverAddress: Address, app: App, token: string): Promise<void> {
        return super.set(serverAddress, app, token);
    }
}

const client = new Client({
    app,
    address,
    token: new TokenProvider('omu-token'),
});
setClient(client)
setChat(client.chat);
const dashboard = new Dashboard(client);
const chat = client.chat;

client.plugins.require({
    omuplugin_chat: null,
    omuchatprovider: null,
});
client.permissions.require(
    permissions.CHAT_CHANNEL_TREE_PERMISSION_ID,
    DASHBOARD_OPEN_APP_PERMISSION_ID,
);

export {
    chat, client, dashboard
};

