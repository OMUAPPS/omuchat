import type { Client } from '@omuchatjs/omu';
import { JsonEndpointType } from '@omuchatjs/omu/extension/endpoint/endpoint.js';
import type { Extension } from '@omuchatjs/omu/extension/extension.js';
import { defineExtensionType } from '@omuchatjs/omu/extension/extension.js';
import { TableExtensionType } from '@omuchatjs/omu/extension/table/table-extension.js';
import { ModelTableType, type Table } from '@omuchatjs/omu/extension/table/table.js';
import { Serializer } from '@omuchatjs/omu/interface/serializable.js';

import { Author, Channel, Message, Provider, Room } from './models/index.js';
import { Identifier } from '@omuchatjs/omu/identifier.js';


export const IDENTIFIER = new Identifier('cc.omuchat', 'chat');


export const MessagesTableKey = ModelTableType.of(IDENTIFIER, {
    name: 'messages', model: Message,
});
export const AuthorsTableKey = ModelTableType.of(IDENTIFIER, {
    name: 'authors', model: Author,
});
export const ChannelsTableKey = ModelTableType.of(IDENTIFIER, {
    name: 'channels', model: Channel,
});
export const ProvidersTableKey = ModelTableType.of(IDENTIFIER, {
    name: 'providers', model: Provider,
});
export const RoomsTableKey = ModelTableType.of(IDENTIFIER, {
    name: 'rooms', model: Room,
});
export const CreateChannelTree = JsonEndpointType.of(IDENTIFIER, {
    name: 'create_channel_tree',
    requestSerializer: Serializer.noop<string>(),
    responseSerializer: Serializer.model(Channel).array(),
});
