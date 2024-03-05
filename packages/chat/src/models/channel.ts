import type { Model } from '@omuchatjs/omu/extension/table/model.js';
import type { Keyable, Timestamped } from '@omuchatjs/omu/interface.js';

export type ChannelJson = {
    provider_id: string;
    id: string;
    url: string;
    name: string;
    description: string;
    active: boolean;
    icon_url: string;
};

export class Channel implements Model<ChannelJson>, Keyable {
    providerId: string;
    id: string;
    url: string;
    name: string;
    description: string;
    active: boolean;
    iconUrl: string;

    constructor(option: ChannelJson) {
        this.providerId = option.provider_id;
        this.id = option.id;
        this.url = option.url;
        this.name = option.name;
        this.description = option.description;
        this.active = option.active;
        this.iconUrl = option.icon_url;
    }

    static fromJson(json: ChannelJson): Channel {
        return new Channel(json);
    }

    key(): string {
        return `${this.providerId}:${this.id}`;
    }

    toJson(): ChannelJson {
        return {
            provider_id: this.providerId,
            id: this.id,
            url: this.url,
            name: this.name,
            description: this.description,
            active: this.active,
            icon_url: this.iconUrl,
        };
    }
}
