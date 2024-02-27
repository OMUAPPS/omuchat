import { Chat } from "@omuchatjs/chat";
import { App } from "@omuchatjs/omu";

import { getTabId } from "$lib/utils/browser-helper.js";


export interface Reaction {
    id: number;
    key: string;
}

const app = new App({
    name: `reaction-${getTabId()}`,
    version: "0.1.0",
    group: "omu.chat.assets",
});
export const client = new Chat({
    app,
});
export const chat = client.chat;

export const emojis: Map<string, HTMLImageElement | undefined> = new Map();
export let scale = 1;
client.omu.registry.listen<Record<string, string>>({
    name: "emojis",
    app: "omu.chat.apps/youtube-reaction",
}, (data) => {
    if (!data) {
        return;
    }
    for (const [key, value] of Object.entries(data)) {
        if (value) {
            const img = new Image();
            img.src = value;
            img.onload = () => {
                emojis.set(key, img);
            }
        } else {
            emojis.delete(key);
        }
    }
});
client.omu.registry.listen<number>({
    name: "scale",
    app: "omu.chat.apps/youtube-reaction",
}, (data) => {
    scale = data ?? 1;
});
