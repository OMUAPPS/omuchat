import type { Keyable, Model } from "@omuchat/omu.js";

export type AssetType = 'app' | 'panel' | 'image';

export interface AssetJson {
    id: string;
    name: string;
    description: string;
    type: AssetType;
    thumbnail: string;
    url: string;
    tags: string[];
}

export class Asset implements Keyable, Model<AssetJson> {
    public id: string;
    public name: string;
    public description: string;
    public type: AssetType;
    public thumbnail: string;
    public url: string;
    public tags: string[];

    public constructor(data: AssetJson) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.type = data.type;
        this.thumbnail = data.thumbnail;
        this.url = data.url;
        this.tags = data.tags;
    }

    public static fromJson(data: AssetJson): Asset {
        return new Asset(data);
    }

    public key(): string {
        return this.id;
    }

    public json(): AssetJson {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            type: this.type,
            thumbnail: this.thumbnail,
            url: this.url,
            tags: this.tags
        };
    }
}

export const TYPE_ICONS = {
    app: 'ti ti-package',
    panel: 'ti ti-layout-grid',
    image: 'ti ti-photo'
};
