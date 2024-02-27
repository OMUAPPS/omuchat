import type { Keyable, Model } from '@omuchatjs/omu/interface/index.js';

import * as content from './content.js';
import type { GiftJson } from './gift.js';
import { Gift } from './gift.js';
import type { PaidJson } from './paid.js';
import { Paid } from './paid.js';

export type MessageJson = {
    room_id: string;
    id: string;
    created_at: string; // ISO 8601 date string
    author_id?: string;
    content?: content.ComponentJson;
    paid?: PaidJson;
    gifts?: GiftJson[];
}

export class Message implements Keyable, Model<MessageJson> {
    roomId: string;
    id: string;
    authorId?: string;
    content?: content.Component;
    paid?: Paid;
    gifts?: Gift[];
    createdAt: Date;

    constructor(options: {
        room_id: string;
        id: string;
        created_at: Date;
        author_id?: string;
        content?: content.Component;
        paid?: Paid;
        gifts?: Gift[];
    }) {
        if (!(options.created_at instanceof Date)) {
            throw new Error('created_at must be a Date');
        }
        this.roomId = options.room_id;
        this.id = options.id;
        this.authorId = options.author_id;
        this.content = options.content;
        this.paid = options.paid;
        this.gifts = options.gifts;
        this.createdAt = options.created_at;
    }

    static fromJson(info: MessageJson): Message {
        return new Message({
            room_id: info.room_id,
            id: info.id,
            author_id: info.author_id,
            content: info.content && content.deserialize(info.content),
            paid: info.paid && Paid.fromJson(info.paid),
            gifts: info.gifts?.map(gift => Gift.fromJson(gift)),
            created_at: new Date(info.created_at),
        });
    }

    get text(): string {
        if (!this.content) {
            return '';
        }
        return this.content.toString();
    }

    key(): string {
        return `${this.roomId}#${this.id}`;
    }

    toJson(): MessageJson {
        return {
            room_id: this.roomId,
            id: this.id,
            author_id: this.authorId,
            created_at: this.createdAt.toISOString(),
            content: this.content && content.serialize(this.content),
            paid: this.paid?.toJson(),
            gifts: this.gifts?.map(gift => gift.toJson()),
        };
    }

    toString(): string {
        return `${this.authorId}: ${this.content}`;
    }
}
