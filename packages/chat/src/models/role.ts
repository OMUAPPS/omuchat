import type { Model } from '@omuchatjs/omu/extension/table/model.js';

export type RoleJson = {
    id?: string;
    name: string;
    is_owner: boolean;
    is_moderator: boolean;
    icon_url?: string;
    color?: string;
};

export class Role implements Model<RoleJson> {
    id?: string;
    name: string;
    isOwner: boolean;
    isModerator: boolean;
    iconUrl?: string;
    color?: string;

    constructor(info: RoleJson) {
        this.id = info.id;
        this.name = info.name;
        this.isOwner = info.is_owner;
        this.isModerator = info.is_moderator;
        this.iconUrl = info.icon_url;
        this.color = info.color;
    }

    toJson(): RoleJson {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            icon_url: this.iconUrl,
            is_owner: this.isOwner,
            is_moderator: this.isModerator,
        };
    }
}
