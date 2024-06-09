import { Identifier } from '@omujs/omu/identifier.js';
import type { Keyable } from '@omujs/omu/interface.js';
import type { Model } from '@omujs/omu/model.js';

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
    providerId: Identifier;
    id: Identifier;
    url: string;
    name: string;
    description: string;
    active: boolean;
    iconUrl: string;

    constructor(option: {
        providerId: Identifier;
        id: Identifier;
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
            providerId: Identifier.fromKey(json.provider_id),
            id: Identifier.fromKey(json.id),
            url: json.url,
            name: json.name,
            description: json.description,
            active: json.active,
            iconUrl: json.icon_url,
        });
    }

    key(): string {
        return this.id.key();
    }

    toJson(): ChannelJson {
        return {
            provider_id: this.providerId.key(),
            id: this.id.key(),
            url: this.url,
            name: this.name,
            description: this.description,
            active: this.active,
            icon_url: this.iconUrl,
        };
    }
}
