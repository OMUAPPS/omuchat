import type { Keyable } from '@omuchatjs/omu/interface.js';
import type { Model } from '@omuchatjs/omu/model.js';

import type { RoleJson } from './role.js';
import { Role } from './role.js';

export type AuthorJson = {
    provider_id: string;
    id: string;
    name: string;
    screen_id?: string;
    avatar_url?: string;
    roles?: RoleJson[];
};

export class Author implements Keyable, Model<AuthorJson> {
    providerId: string;
    id: string;
    name: string;
    screenId?: string;
    avatarUrl?: string;
    roles?: Role[];

    constructor(options: {
        provider_id: string;
        id: string;
        name: string;
        screen_id?: string;
        avatar_url?: string;
        roles?: Role[];
    }) {
        this.providerId = options.provider_id;
        this.id = options.id;
        this.name = options.name;
        this.screenId = options.screen_id;
        this.avatarUrl = options.avatar_url;
        this.roles = options.roles;
    }

    static fromJson(info: AuthorJson): Author {
        return new Author({
            provider_id: info.provider_id,
            id: info.id,
            name: info.name,
            screen_id: info.screen_id,
            avatar_url: info.avatar_url,
            roles: info.roles?.map((role) => Role.fromJson(role)),
        });
    }

    key(): string {
        return `${this.providerId}:${this.id}`;
    }

    toJson(): AuthorJson {
        return {
            provider_id: this.providerId,
            id: this.id,
            name: this.name,
            screen_id: this.screenId,
            avatar_url: this.avatarUrl,
            roles: this.roles?.map((role) => role.toJson()),
        };
    }
}
