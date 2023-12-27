import { Client } from "@omuchat/client";
import { App } from "@omuchat/omu.js";

export interface Emoji {
    id: string;
    name: string;
    image_url: string;
    regex: string;
}

const app = new App({
    name: "emoji",
    version: "0.1.0",
    group: "omu-app",
});
export const client = new Client({
    app,
});