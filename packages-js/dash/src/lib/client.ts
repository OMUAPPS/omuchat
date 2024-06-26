import { setClient } from '@omujs/ui';
import { Dashboard } from './dashboard.js';

import type { Address } from '@omujs/omu/address.js';

import { invoke, IS_TAURI } from '$lib/utils/tauri.js';

import { Chat } from '@omujs/chat';
import { CHAT_CHANNEL_TREE_PERMISSION_ID } from '@omujs/chat/permissions.js';
import { App, Omu } from '@omujs/omu';
import {
    DASHBOARD_OPEN_APP_PERMISSION_ID,
    DASHOBARD_APP_EDIT_PERMISSION_ID,
    DASHOBARD_APP_READ_PERMISSION_ID,
} from '@omujs/omu/extension/dashboard/index.js';
import {
    I18N_GET_LOCALES_PERMISSION_ID,
    I18N_SET_LOCALES_PERMISSION_ID,
} from '@omujs/omu/extension/i18n/index.js';
import {
    SERVER_APPS_READ_PERMISSION_ID,
    SERVER_SHUTDOWN_PERMISSION_ID,
} from '@omujs/omu/extension/server/index.js';
import { Identifier } from '@omujs/omu/identifier.js';
import { BrowserTokenProvider } from '@omujs/omu/token.js';
import { setChat } from '../../../ui/dist/stores.js';

const IDENTIFIER = new Identifier('com.omuapps', 'dashboard');
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
    omuplugin_chat: '==0.4.11',
    omu_chatprovider: '==0.4.11',
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

export { chat, dashboard, omu };

import { checkUpdate } from '@tauri-apps/api/updater';
import { screenContext } from './common/screen/screen.js';
import UpdateScreen from './main/screen/UpdateScreen.svelte';

checkUpdate().then((update) => {
    const { manifest, shouldUpdate } = update;
    if (!shouldUpdate || !manifest) return;

    omu.onReady(() => {
        screenContext.push(UpdateScreen, { manifest });
    });
});
