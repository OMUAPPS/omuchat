import { IDENTIFIER } from './const.js';

export const CHAT_PERMISSION_ID = IDENTIFIER;
export const CHAT_READ_PERMISSION_ID = IDENTIFIER.join('chat', 'read');
export const CHAT_WRITE_PERMISSION_ID = IDENTIFIER.join('chat', 'write');
export const CHAT_SEND_PERMISSION_ID = IDENTIFIER.join('chat', 'send');
export const CHAT_CHANNEL_TREE_PERMISSION_ID = IDENTIFIER.join('create_channel_tree');
export const CHAT_REACTION_PERMISSION_ID = IDENTIFIER.join('reaction');
