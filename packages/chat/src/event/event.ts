import type { Table } from '@omuchatjs/omu/extension/table/index.js';
import type { Keyable } from '@omuchatjs/omu/interface.js';

import type { Client } from '../client.js';
import type { Author, Channel, Message, Provider, Room } from '../models/index.js';

export class EventKey<T extends unknown[]> {
    constructor(
        public readonly name: string,
        public readonly create: (
            client: Client,
            invoke: (...data: T) => void,
        ) => void = (): void => { },
    ) { }
}

function initTableEvent<T extends Keyable>(consumer: (client: Client) => Table<T>) {
    return (client: Client, invoke: (...data: T[]) => void): void => {
        const table = consumer(client);
        table.listen();
        table.addListener({
            onAdd: (items) => {
                for (const item of items.values()) {
                    invoke(item);
                }
            },
        });
    };
}

export const events = {
    Ready: new EventKey<[]>('ready', (client, invoke) => {
        client.network.listeners.connected.subscribe(() => invoke());
    }),
    MessageCreate: new EventKey<[Message]>(
        'on_message',
        initTableEvent((client) => client.chat.messages),
    ),
    MessageUpdate: new EventKey<[Message]>(
        'on_message_update',
        initTableEvent((client) => client.chat.messages),
    ),
    MessageDelete: new EventKey<[Message]>(
        'on_message_delete',
        initTableEvent((client) => client.chat.messages),
    ),
    AuthorCreate: new EventKey<[Author]>(
        'on_author_create',
        initTableEvent((client) => client.chat.authors),
    ),
    AuthorUpdate: new EventKey<[Author]>(
        'on_author_update',
        initTableEvent((client) => client.chat.authors),
    ),
    AuthorDelete: new EventKey<[Author]>(
        'on_author_delete',
        initTableEvent((client) => client.chat.authors),
    ),
    ChannelCreate: new EventKey<[Channel]>(
        'on_channel_create',
        initTableEvent((client) => client.chat.channels),
    ),
    ChannelUpdate: new EventKey<[Channel]>(
        'on_channel_update',
        initTableEvent((client) => client.chat.channels),
    ),
    ChannelDelete: new EventKey<[Channel]>(
        'on_channel_delete',
        initTableEvent((client) => client.chat.channels),
    ),
    ProviderCreate: new EventKey<[Provider]>(
        'on_provider_create',
        initTableEvent((client) => client.chat.providers),
    ),
    ProviderUpdate: new EventKey<[Provider]>(
        'on_provider_update',
        initTableEvent((client) => client.chat.providers),
    ),
    ProviderDelete: new EventKey<[Provider]>(
        'on_provider_delete',
        initTableEvent((client) => client.chat.providers),
    ),
    RoomCreate: new EventKey<[Room]>(
        'on_room_create',
        initTableEvent((client) => client.chat.rooms),
    ),
    RoomUpdate: new EventKey<[Room]>(
        'on_room_update',
        initTableEvent((client) => client.chat.rooms),
    ),
    RoomDelete: new EventKey<[Room]>(
        'on_room_delete',
        initTableEvent((client) => client.chat.rooms),
    ),
};
