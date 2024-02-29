import type { Table } from '@omuchatjs/omu/extension/table/table.js';
import type { Keyable } from '@omuchatjs/omu/interface.js';

import type { Client } from '../client.js';
import type { Author, Channel, Message, Provider, Room } from '../models/index.js';

export class EventKey<T extends unknown[]> {
    constructor(
        public readonly name: string,
        public readonly create: (client: Client, invoke: (...data: T) => void) => void = (): void => { },
    ) { }
}

function initTableEvent<T extends Keyable>(
    consumer: (client: Client) => Table<T>,
) {
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
        client.omu.addListener({
            onReady: () => {
                invoke();
            },
        });
    }),
    MessageCreate: new EventKey<[Message]>('on_message', initTableEvent((client) => client.messages)),
    MessageUpdate: new EventKey<[Message]>('on_message_update', initTableEvent((client) => client.messages)),
    MessageDelete: new EventKey<[Message]>('on_message_delete', initTableEvent((client) => client.messages)),
    AuthorCreate: new EventKey<[Author]>('on_author_create', initTableEvent((client) => client.authors)),
    AuthorUpdate: new EventKey<[Author]>('on_author_update', initTableEvent((client) => client.authors)),
    AuthorDelete: new EventKey<[Author]>('on_author_delete', initTableEvent((client) => client.authors)),
    ChannelCreate: new EventKey<[Channel]>('on_channel_create', initTableEvent((client) => client.channels)),
    ChannelUpdate: new EventKey<[Channel]>('on_channel_update', initTableEvent((client) => client.channels)),
    ChannelDelete: new EventKey<[Channel]>('on_channel_delete', initTableEvent((client) => client.channels)),
    ProviderCreate: new EventKey<[Provider]>('on_provider_create', initTableEvent((client) => client.providers)),
    ProviderUpdate: new EventKey<[Provider]>('on_provider_update', initTableEvent((client) => client.providers)),
    ProviderDelete: new EventKey<[Provider]>('on_provider_delete', initTableEvent((client) => client.providers)),
    RoomCreate: new EventKey<[Room]>('on_room_create', initTableEvent((client) => client.rooms)),
    RoomUpdate: new EventKey<[Room]>('on_room_update', initTableEvent((client) => client.rooms)),
    RoomDelete: new EventKey<[Room]>('on_room_delete', initTableEvent((client) => client.rooms)),
};
