import { JsonEndpointType } from '@omuchatjs/omu/extension/endpoint/endpoint.js';
import { TableType } from '@omuchatjs/omu/extension/table/table.js';
import { Identifier } from '@omuchatjs/omu/identifier.js';
import { Serializer } from '@omuchatjs/omu/serializer.js';
import { Author, Channel, Message, Provider, Room } from './models/index.js';


export const IDENTIFIER = new Identifier('cc.omuchat', 'chat');


export const MessagesTableKey = TableType.model(IDENTIFIER, {
    name: 'messages', model: Message,
});
export const AuthorsTableKey = TableType.model(IDENTIFIER, {
    name: 'authors', model: Author,
});
export const ChannelsTableKey = TableType.model(IDENTIFIER, {
    name: 'channels', model: Channel,
});
export const ProvidersTableKey = TableType.model(IDENTIFIER, {
    name: 'providers', model: Provider,
});
export const RoomsTableKey = TableType.model(IDENTIFIER, {
    name: 'rooms', model: Room,
});
export const CreateChannelTree = JsonEndpointType.of(IDENTIFIER, {
    name: 'create_channel_tree',
    requestSerializer: Serializer.noop<string>(),
    responseSerializer: Serializer.model(Channel).array(),
});
