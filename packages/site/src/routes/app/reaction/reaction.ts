import { MessageType } from "@omuchatjs/omu/extension/message/index.js";
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
