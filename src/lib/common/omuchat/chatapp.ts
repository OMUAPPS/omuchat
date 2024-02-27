import type { Keyable, Model } from "@omuchatjs/omu/interface/index.js";

export type AssetType = 'app' | 'panel' | 'image';

export type ApplicationJson = {
    id: string;
    name?: string;
    icon?: string;
    description?: string;
    thumbnail?: string;
    url: string;
    tags: string[];
}

export class ChatApp implements Keyable, Model<ApplicationJson> {
    public id: string;
    public name?: string;
    public icon?: string;
    public description?: string;
    public thumbnail?: string;
    public url: string;
    public tags: string[];

    public constructor(data: ApplicationJson) {
        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.description = data.description;
        this.thumbnail = data.thumbnail;
        this.url = data.url;
        this.tags = data.tags;
    }

    public static fromJson(data: ApplicationJson): ChatApp {
        return new ChatApp(data);
    }

    public key(): string {
        return this.id;
    }

    toJson(): ApplicationJson {
        return {
            id: this.id,
            name: this.name,
            icon: this.icon,
            description: this.description,
            thumbnail: this.thumbnail,
            url: this.url,
            tags: this.tags
        };
    }
}
