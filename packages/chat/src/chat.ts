import type { Client } from '@omuchatjs/omu';
import { EndpointType } from '@omuchatjs/omu/extension/endpoint/endpoint.js';
import type { Table } from '@omuchatjs/omu/extension/table/table.js';
import { TableType } from '@omuchatjs/omu/extension/table/table.js';
import { Identifier } from '@omuchatjs/omu/identifier.js';
import { Serializer } from '@omuchatjs/omu/serializer.js';

import { Author, Channel, Message, Provider, Room } from './models/index.js';

export const IDENTIFIER = new Identifier('cc.omuchat', 'chat');

export const MessagesTableKey = TableType.model(IDENTIFIER, {
    name: 'messages',
    model: Message,
});
export const AuthorsTableKey = TableType.model(IDENTIFIER, {
    name: 'authors',
    model: Author,
});
export const ChannelsTableKey = TableType.model(IDENTIFIER, {
    name: 'channels',
    model: Channel,
});
export const ProvidersTableKey = TableType.model(IDENTIFIER, {
    name: 'providers',
    model: Provider,
});
export const RoomsTableKey = TableType.model(IDENTIFIER, {
    name: 'rooms',
    model: Room,
});
export const CreateChannelTree = EndpointType.createJson(IDENTIFIER, {
    name: 'create_channel_tree',
    requestSerializer: Serializer.noop<string>().pipe(Serializer.json()),
    responseSerializer: Serializer.model(Channel).array().pipe(Serializer.json()),
});

export class Chat {
    readonly messages: Table<Message>;
    readonly authors: Table<Author>;
    readonly channels: Table<Channel>;
    readonly providers: Table<Provider>;
    readonly rooms: Table<Room>;

    constructor(private readonly client: Client) {
        this.messages = client.tables.get(MessagesTableKey);
        this.authors = client.tables.get(AuthorsTableKey);
        this.channels = client.tables.get(ChannelsTableKey);
        this.providers = client.tables.get(ProvidersTableKey);
        this.rooms = client.tables.get(RoomsTableKey);
        this.messages.setCacheSize(1000);
        this.authors.setCacheSize(500);
    }

    async createChannelTree(url: string): Promise<Channel[]> {
        return await this.client.endpoints.call(CreateChannelTree, url);
    }
}
