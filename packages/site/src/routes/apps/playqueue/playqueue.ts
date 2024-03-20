import type { Author, Message } from '@omuchatjs/chat/models/index.js';

export interface Entry {
    author: Author;
    message: Message;
    element: HTMLElement | null;
}
