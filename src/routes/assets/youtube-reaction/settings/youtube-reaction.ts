import { App, Chat } from '@omuchatjs/chat';

export const app = new App({
    name: 'youtube-reaction',
    version: '0.1.0',
    group: 'omu.chat.apps',
});
export const client = new Chat({
    app,
});
