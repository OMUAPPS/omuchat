import { Identifier } from '@omujs/omu';
import type { Keyable } from '@omujs/omu/interface.js';
import type { Model } from '@omujs/omu/model.js';

export type Choice = {
    text: string;
    ratio: number;
    count?: number;
};

export type VoteJson = {
    id: string;
    room_id: string;
    title: string;
    choices: Choice[];
    ended: boolean;
    total: number | null;
};

export class Vote implements Keyable, Model<VoteJson> {
    public readonly id: Identifier;
    public readonly roomId: Identifier;
    public title: string;
    public choices: Choice[];
    public ended: boolean;
    public total: number | null;

    constructor(options: {
        id: Identifier;
        roomId: Identifier;
        title: string;
        choices: Choice[];
        ended: boolean;
        total: number | null;
    }) {
        this.id = options.id;
        this.roomId = options.roomId;
        this.title = options.title;
        this.choices = options.choices;
        this.ended = options.ended;
        this.total = options.total;
    }

    public static fromJson(options: VoteJson): Vote {
        return new Vote({
            id: Identifier.fromKey(options.id),
            roomId: Identifier.fromKey(options.room_id),
            title: options.title,
            choices: options.choices,
            ended: options.ended,
            total: options.total,
        });
    }

    public toJson(): VoteJson {
        return {
            id: this.id.key(),
            room_id: this.roomId.key(),
            title: this.title,
            choices: this.choices,
            ended: this.ended,
            total: this.total,
        };
    }

    public key(): string {
        return this.id.key();
    }
}
