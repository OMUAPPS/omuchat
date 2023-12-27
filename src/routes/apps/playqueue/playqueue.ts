import type { Author, Message } from "@omuchat/client/src/models";

export interface Entry {
    author: Author;
    message: Message;
    element: HTMLElement | null;
}