import { TableEvent } from './event.js';

export const events = {
    message: new TableEvent((chat) => chat.messages),
    author: new TableEvent((chat) => chat.authors),
    channel: new TableEvent((chat) => chat.channels),
    provider: new TableEvent((chat) => chat.providers),
    room: new TableEvent((chat) => chat.rooms),
};
