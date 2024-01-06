import { App, Client } from "@omuchat/client";

export const app = new App({
    name: 'youtube-reaction',
    version: '0.1.0',
    group: 'omu.chat.apps'
});
export const client = new Client({
    app
});