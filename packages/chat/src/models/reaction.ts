import { Identifier } from '@omujs/omu';
import type { Model } from '@omujs/omu/model.js';

export type ReactionJson = {
    room_id: string;
    reactions: {
        [key: string]: number;
    };
};

export class Reaction implements Model<ReactionJson> {
    public roomId: Identifier;
    public reactions: {
        [key: string]: number;
    };

    constructor(options: {
        roomId: Identifier;
        reactions: {
            [key: string]: number;
        };
    }) {
        this.roomId = options.roomId;
        this.reactions = options.reactions;
    }

    static fromJson(data: ReactionJson): Reaction {
        return new Reaction({
            roomId: Identifier.fromKey(data.room_id),
            reactions: data.reactions,
        });
    }

    toJson(): ReactionJson {
        return {
            room_id: this.roomId.key(),
            reactions: this.reactions,
        };
    }
}
