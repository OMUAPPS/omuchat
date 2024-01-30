import type { Model } from '@omuchatjs/omu/interface/index.js';

export type RoleJson = {
    id?: string;
    name: string;
    is_owner: boolean;
    is_moderator: boolean;
    icon_url?: string;
    color?: string;
}

export class Role implements Model<RoleJson> {
    id?: string;
    name: string;
    is_owner: boolean;
    is_moderator: boolean;
    icon_url?: string;
    color?: string;

    constructor(info: RoleJson) {
        this.id = info.id;
        this.name = info.name;
        this.is_owner = info.is_owner;
        this.is_moderator = info.is_moderator;
        this.icon_url = info.icon_url;
        this.color = info.color;
    }

    toJson(): RoleJson {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            icon_url: this.icon_url,
            is_owner: this.is_owner,
            is_moderator: this.is_moderator,
        };
    }

    toString(): string {
        return this.name;
    }
}
