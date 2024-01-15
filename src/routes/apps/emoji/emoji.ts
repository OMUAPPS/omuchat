import { Client } from "@omuchatjs/chat";
import { App } from "@omuchatjs/omu";

export interface Emoji {
    id: string;
    name: string;
    image_url: string;
    regex: string;
}

const app = new App({
    name: "emoji",
    version: "0.1.0",
    group: "omu.chat.apps",
});
export const client = new Client({
    app,
});