import type { Keyable, Model } from '@omuchatjs/omu/interface/index.js';

export type RoomJson = {
    id: string;
    provider_id: string;
    channel_id?: string;
    name?: string;
    description?: string;
    online: boolean;
    url: string;
    image_url?: string;
    viewers?: number;
}

export class Room implements Keyable, Model<RoomJson> {
    id: string;
    provider_id: string;
    channel_id?: string;
    name?: string;
    description?: string;
    online: boolean;
    url: string;
    image_url?: string;
    viewers?: number;

    constructor(json: RoomJson) {
        this.id = json.id;
        this.provider_id = json.provider_id;
        this.channel_id = json.channel_id;
        this.name = json.name;
        this.description = json.description;
        this.online = json.online;
        this.url = json.url;
        this.image_url = json.image_url;
        this.viewers = json.viewers;
    }
    toString(): string {
        throw new Error('Method not implemented.');
    }

    static fromJson(json: RoomJson): Room {
        return new Room(json);
    }

    key(): string {
        return `${this.id}@${this.provider_id}`;
    }

    toJson(): RoomJson {
        return {
            id: this.id,
            provider_id: this.provider_id,
            channel_id: this.channel_id,
            name: this.name,
            description: this.description,
            online: this.online,
            url: this.url,
            image_url: this.image_url,
            viewers: this.viewers,
        };
    }
}
