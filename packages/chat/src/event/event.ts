import type { Client } from '../client/index.js';
import type { Author, Channel, Message, Provider, Room } from '../models/index.js';

export class EventKey<T extends unknown[]> {
    constructor(
        public readonly name: string,
        public readonly create: (client: Client, invoke: (...data: T) => void) => void = (): void => {},
    ) {}
}

export const events = {
    Ready: new EventKey<[]>('ready'),
    MessageCreate: new EventKey<[Message]>('on_message', (client, invoke) => {
        client.chat.messages.listen();
        client.chat.messages.addListener({
            onAdd: (messages) => {
                for (const message of messages.values()) {
                    invoke(message);
                }
            },
        });
    }),
    MessageUpdate: new EventKey<[Message]>('on_message_update', (client, invoke) => {
        client.chat.messages.listen();
        client.chat.messages.addListener({
            onUpdate: (messages) => {
                for (const message of messages.values()) {
                    invoke(message);
                }
            },
        });
    }),
    MessageDelete: new EventKey<[Message]>('on_message_delete', (client, invoke) => {
        client.chat.messages.listen();
        client.chat.messages.addListener({
            onRemove: (messages) => {
                for (const message of messages.values()) {
                    invoke(message);
                }
            },
        });
    }),
    AuthorCreate: new EventKey<[Author]>('on_author_create', (client, invoke) => {
        client.chat.authors.listen();
        client.chat.authors.addListener({
            onAdd: (authors) => {
                for (const author of authors.values()) {
                    invoke(author);
                }
            },
        });
    }),
    AuthorUpdate: new EventKey<[Author]>('on_author_update', (client, invoke) => {
        client.chat.authors.listen();
        client.chat.authors.addListener({
            onUpdate: (authors) => {
                for (const author of authors.values()) {
                    invoke(author);
                }
            },
        });
    }),
    AuthorDelete: new EventKey<[Author]>('on_author_delete', (client, invoke) => {
        client.chat.authors.listen();
        client.chat.authors.addListener({
            onRemove: (authors) => {
                for (const author of authors.values()) {
                    invoke(author);
                }
            },
        });
    }),
    ChannelCreate: new EventKey<[Channel]>('on_channel_create', (client, invoke) => {
        client.chat.channels.listen();
        client.chat.channels.addListener({
            onAdd: (channels) => {
                for (const channel of channels.values()) {
                    invoke(channel);
                }
            },
        });
    }),
    ChannelUpdate: new EventKey<[Channel]>('on_channel_update', (client, invoke) => {
        client.chat.channels.listen();
        client.chat.channels.addListener({
            onUpdate: (channels) => {
                for (const channel of channels.values()) {
                    invoke(channel);
                }
            },
        });
    }),
    ChannelDelete: new EventKey<[Channel]>('on_channel_delete', (client, invoke) => {
        client.chat.channels.listen();
        client.chat.channels.addListener({
            onRemove: (channels) => {
                for (const channel of channels.values()) {
                    invoke(channel);
                }
            },
        });
    }),
    ProviderCreate: new EventKey<[Provider]>('on_provider_create', (client, invoke) => {
        client.chat.providers.listen();
        client.chat.providers.addListener({
            onAdd: (providers) => {
                for (const provider of providers.values()) {
                    invoke(provider);
                }
            },
        });
    }),
    ProviderUpdate: new EventKey<[Provider]>('on_provider_update', (client, invoke) => {
        client.chat.providers.listen();
        client.chat.providers.addListener({
            onUpdate: (providers) => {
                for (const provider of providers.values()) {
                    invoke(provider);
                }
            },
        });
    }),
    ProviderDelete: new EventKey<[Provider]>('on_provider_delete', (client, invoke) => {
        client.chat.providers.listen();
        client.chat.providers.addListener({
            onRemove: (providers) => {
                for (const provider of providers.values()) {
                    invoke(provider);
                }
            },
        });
    }),
    RoomCreate: new EventKey<[Room]>('on_room_create', (client, invoke) => {
        client.chat.rooms.listen();
        client.chat.rooms.addListener({
            onAdd: (rooms) => {
                for (const room of rooms.values()) {
                    invoke(room);
                }
            },
        });
    }),
    RoomUpdate: new EventKey<[Room]>('on_room_update', (client, invoke) => {
        client.chat.rooms.listen();
        client.chat.rooms.addListener({
            onUpdate: (rooms) => {
                for (const room of rooms.values()) {
                    invoke(room);
                }
            },
        });
    }),
    RoomDelete: new EventKey<[Room]>('on_room_delete', (client, invoke) => {
        client.chat.rooms.listen();
        client.chat.rooms.addListener({
            onRemove: (rooms) => {
                for (const room of rooms.values()) {
                    invoke(room);
                }
            },
        });
    }),
};
