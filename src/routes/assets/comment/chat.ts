import { Chat } from '@omuchatjs/chat';
import { App } from '@omuchatjs/omu';

import { getTabId } from '$lib/utils/browser-helper.js';

const app = new App({
    name: `emoji-${getTabId()}`,
    version: '0.1.0',
    group: 'omu.chat.assets',
});
export const client = new Chat({
    app,
});
export const chat = client.chat;
