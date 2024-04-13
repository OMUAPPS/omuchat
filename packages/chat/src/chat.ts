import type { Client } from '@omuchatjs/omu';
import { EndpointType } from '@omuchatjs/omu/extension/endpoint/endpoint.js';
import type { Table } from '@omuchatjs/omu/extension/table/index.js';
import { TableType } from '@omuchatjs/omu/extension/table/index.js';
import { Identifier } from '@omuchatjs/omu/identifier.js';
import { Serializer } from '@omuchatjs/omu/serializer.js';

import { Author, Channel, Message, Provider, Room } from './models/index.js';

export const IDENTIFIER = new Identifier('cc.omuchat', 'chat');

export const MESSAGE_TABLE_TYPE = TableType.model(IDENTIFIER, {
    name: 'messages',
    model: Message,
});
export const AUTHOR_TABLE_TYPE = TableType.model(IDENTIFIER, {
    name: 'authors',
    model: Author,
});
export const CHANNEL_TABLE_TYPE = TableType.model(IDENTIFIER, {
    name: 'channels',
    model: Channel,
});
export const PROVIDER_TABLE_TYPE = TableType.model(IDENTIFIER, {
    name: 'providers',
    model: Provider,
});
export const ROOM_TABLE_TYPE = TableType.model(IDENTIFIER, {
    name: 'rooms',
    model: Room,
});
export const CREATE_CHANNEL_TREE_ENDPOINT = EndpointType.createJson(IDENTIFIER, {
    name: 'create_channel_tree',
    requestSerializer: Serializer.noop<string>(),
    responseSerializer: Serializer.model(Channel).toArray(),
});

export class Chat {
    readonly messages: Table<Message>;
    readonly authors: Table<Author>;
    readonly channels: Table<Channel>;
    readonly providers: Table<Provider>;
    readonly rooms: Table<Room>;

    constructor(private readonly client: Client) {
        this.messages = client.tables.get(MESSAGE_TABLE_TYPE);
        this.authors = client.tables.get(AUTHOR_TABLE_TYPE);
        this.channels = client.tables.get(CHANNEL_TABLE_TYPE);
        this.providers = client.tables.get(PROVIDER_TABLE_TYPE);
        this.rooms = client.tables.get(ROOM_TABLE_TYPE);
        this.messages.setCacheSize(1000);
        this.authors.setCacheSize(500);
    }

    async createChannelTree(url: string): Promise<Channel[]> {
        return await this.client.endpoints.call(CREATE_CHANNEL_TREE_ENDPOINT, url);
    }
}
