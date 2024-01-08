import type { Author, Message } from "@omuchat/client/models/index.js";

export interface Entry {
    author: Author;
    message: Message;
    element: HTMLElement | null;
}