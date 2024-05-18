import { setClient } from '@omuchatjs/ui';
import { Dashboard } from './dashboard.js';

import type { Address } from '@omuchatjs/omu/address.js';

import { invoke, IS_TAURI } from '$lib/utils/tauri.js';

import { CHAT_CHANNEL_TREE_PERMISSION_ID } from '@omuchatjs/chat/permissions.js';
import {
    DASHBOARD_OPEN_APP_PERMISSION_ID,
    DASHOBARD_APP_EDIT_PERMISSION_ID,
    DASHOBARD_APP_READ_PERMISSION_ID,
} from '@omuchatjs/omu/extension/dashboard/index.js';
import {
    I18N_GET_LOCALES_PERMISSION_ID,
    I18N_SET_LOCALES_PERMISSION_ID,
} from '@omuchatjs/omu/extension/i18n/index.js';
import {
    SERVER_APPS_READ_PERMISSION_ID,
    SERVER_SHUTDOWN_PERMISSION_ID,
} from '@omuchatjs/omu/extension/server/index.js';
import { Identifier } from '@omuchatjs/omu/identifier.js';
import { setChat } from '../../../../../ui/dist/stores.js';
import { App, Omu } from '@omuchatjs/omu';
import { Chat } from '@omuchatjs/chat';
import { BrowserTokenProvider } from '@omuchatjs/omu/token.js';

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

const omu = new Omu(app, {
    address,
    token: new TokenProvider('omu-token'),
});
const chat = new Chat(omu);
const dashboard = new Dashboard(omu);
setClient(omu);
setChat(chat);

omu.plugins.require({
    omuplugin_chat: '==0.3.2',
    omuchatprovider: '==0.3.2',
});
omu.permissions.require(
    CHAT_CHANNEL_TREE_PERMISSION_ID,
    DASHBOARD_OPEN_APP_PERMISSION_ID,
    SERVER_SHUTDOWN_PERMISSION_ID,
    SERVER_APPS_READ_PERMISSION_ID,
    DASHOBARD_APP_READ_PERMISSION_ID,
    DASHOBARD_APP_EDIT_PERMISSION_ID,
    I18N_GET_LOCALES_PERMISSION_ID,
    I18N_SET_LOCALES_PERMISSION_ID,
);

export { chat, omu, dashboard };
