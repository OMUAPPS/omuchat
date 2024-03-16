import type { Keyable } from '@omuchatjs/omu/interface.js';
import type { Model } from '@omuchatjs/omu/model.js';

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

    constructor(option: {
        providerId: string;
        id: string;
        url: string;
        name: string;
        description: string;
        active: boolean;
        iconUrl: string;
    }) {
        this.providerId = option.providerId;
        this.id = option.id;
        this.url = option.url;
        this.name = option.name;
        this.description = option.description;
        this.active = option.active;
        this.iconUrl = option.iconUrl;
    }

    static fromJson(json: ChannelJson): Channel {
        return new Channel({
            providerId: json.provider_id,
            id: json.id,
            url: json.url,
            name: json.name,
            description: json.description,
            active: json.active,
            iconUrl: json.icon_url,
        });
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
