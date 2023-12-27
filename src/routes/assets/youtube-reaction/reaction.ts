import { Client } from "@omuchat/client";
import { App } from "@omuchat/omu.js";
import { writable, type Writable } from "svelte/store";

import { getTabId } from "$lib/utils/browser-helper";


export interface Reaction {
    id: number;
    key: string;
}

const app = new App({
    name: `reaction-${getTabId()}`,
    version: "0.1.0",
    group: "omu-assets",
});
export const client = new Client({
    app,
});
export const chat = client.chat;

export const emojis: Map<string, string | undefined> = new Map();

client.omu.registry.listen({
    name: "emojis",
    app: "omu-apps/youtube-reaction",
}, (data: Record<string, string | undefined>) => {
    for (const [key, value] of Object.entries(data)) {
        emojis.set(key, value);
    }
});

export const reactions: Writable<Map<number, Reaction>> = writable(new Map());
