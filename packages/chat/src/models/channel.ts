import type { Keyable, Model } from '@omuchatjs/omu/interface/index.js';

export type ChannelJson = {
    provider_id: string;
    id: string;
    url: string;
    name: string;
    description: string;
    active: boolean;
    icon_url: string;
    created_at: number;
}

export class Channel implements Keyable, Model<ChannelJson> {
    provider_id: string;
    id: string;
    url: string;
    name: string;
    description: string;
    active: boolean;
    icon_url: string;
    created_at: number;

    constructor(option: ChannelJson) {
        this.provider_id = option.provider_id;
        this.id = option.id;
        this.url = option.url;
        this.name = option.name;
        this.description = option.description;
        this.active = option.active;
        this.icon_url = option.icon_url;
        this.created_at = option.created_at;
    }
    toString(): string {
        throw new Error('Method not implemented.');
    }

    static fromJson(json: ChannelJson): Channel {
        return new Channel(json);
    }

    key(): string {
        return `${this.provider_id}:${this.id}`
    }

    toJson(): ChannelJson {
        return {
            provider_id: this.provider_id,
            id: this.id,
            url: this.url,
            name: this.name,
            description: this.description,
            active: this.active,
            icon_url: this.icon_url,
            created_at: this.created_at,
        };
    }
}
