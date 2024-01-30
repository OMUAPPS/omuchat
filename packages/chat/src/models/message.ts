import type { Keyable, Model } from '@omuchatjs/omu/interface/index.js';

import type { ContentJson } from './content.js';
import { ContentComponent, TextContent } from './content.js';
import type { GiftJson } from './gift.js';
import { Gift } from './gift.js';
import type { PaidJson } from './paid.js';
import { Paid } from './paid.js';

export type MessageJson = {
    room_id: string;
    id: string;
    created_at: string; // ISO 8601 date string
    author_id?: string;
    content?: ContentJson;
    paid?: PaidJson;
    gifts?: GiftJson[];
}

export class Message implements Keyable, Model<MessageJson> {
    room_id: string;
    id: string;
    author_id?: string;
    content?: ContentComponent;
    paid?: Paid;
    gifts?: Gift[];
    created_at: Date;

    constructor(options: {
        room_id: string;
        id: string;
        created_at: Date;
        author_id?: string;
        content?: ContentComponent;
        paid?: Paid;
        gifts?: Gift[];
    }) {
        if (!(options.created_at instanceof Date)) {
            throw new Error('created_at must be a Date');
        }
        this.room_id = options.room_id;
        this.id = options.id;
        this.author_id = options.author_id;
        this.content = options.content;
        this.paid = options.paid;
        this.gifts = options.gifts;
        this.created_at = options.created_at;
    }

    static fromJson(info: MessageJson): Message {
        return new Message({
            room_id: info.room_id,
            id: info.id,
            author_id: info.author_id,
            content: info.content && ContentComponent.fromJson(info.content),
            paid: info.paid && Paid.fromJson(info.paid),
            gifts: info.gifts?.map(gift => Gift.fromJson(gift)),
            created_at: new Date(info.created_at),
        });
    }

    get text(): string {
        if (!this.content) {
            return '';
        }
        const parts: string[] = [];
        const components = [this.content];
        while (components.length) {
            const component = components.shift();
            if (!component) {
                continue;
            }
            if (component instanceof TextContent) {
                parts.push(component.text);
            }
            if (component.siblings) {
                components.push(...component.siblings);
            }
        }
        return parts.join('');
    }

    key(): string {
        return `${this.room_id}#${this.id}`;
    }

    toJson(): MessageJson {
        return {
            room_id: this.room_id,
            id: this.id,
            author_id: this.author_id,
            created_at: this.created_at.toISOString(),
            content: this.content?.toJson(),
            paid: this.paid?.toJson(),
            gifts: this.gifts?.map(gift => gift.toJson()),
        };
    }

    toString(): string {
        return `${this.author_id}: ${this.content}`;
    }
}
