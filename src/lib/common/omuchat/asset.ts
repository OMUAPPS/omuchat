import type { Keyable, Model } from "@omuchat/omu.js/interface/index.js";

export type AssetType = 'app' | 'panel' | 'image';

export interface AssetJson {
    id: string;
    name?: string;
    icon?: string;
    description?: string;
    thumbnail?: string;
    url: string;
    tags: string[];
}

export class Asset implements Keyable, Model<AssetJson> {
    public id: string;
    public name?: string;
    public icon?: string;
    public description?: string;
    public thumbnail?: string;
    public url: string;
    public tags: string[];

    public constructor(data: AssetJson) {
        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.description = data.description;
        this.thumbnail = data.thumbnail;
        this.url = data.url;
        this.tags = data.tags;
    }

    public static fromJson(data: AssetJson): Asset {
        return new Asset(data);
    }

    key(): string {
        return this.id;
    }

    toJson(): AssetJson {
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
