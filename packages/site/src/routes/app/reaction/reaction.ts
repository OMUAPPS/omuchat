import { MessageType } from "@omuchatjs/omu/extension/message/index.js";
import { RegistryType } from "@omuchatjs/omu/extension/registry/index.js";
import { Identifier } from "@omuchatjs/omu/identifier.js";

const PROVIDER_IDENTIFIER = new Identifier('cc.omuchat', 'chatprovider');
const YOUTUBE_IDENTIFIER = PROVIDER_IDENTIFIER.join('youtube');


export type ReactionMessage = {
    room_id: string;
    reactions: {
        [key: string]: number;
    };
}

export const REACTION_MESSAGE_TYPE = MessageType.createJson<ReactionMessage>(YOUTUBE_IDENTIFIER, {
    name: 'reaction',
});

export type ReactionReplaceRegistry = Record<string, string | null>;

export const REACTION_REPLACE_REGISTRY_TYPE = RegistryType.createJson<ReactionReplaceRegistry>(YOUTUBE_IDENTIFIER, {
    name: 'reaction_replace',
    defaultValue: {
        '😳': null,
        '😄': null,
        '❤': null,
        '🎉': null,
        '💯': null,
    },
});
