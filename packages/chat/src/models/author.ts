import type { Keyable, Model } from '@omuchatjs/omu/interface/index.js';

import type { RoleJson } from './role.js';
import { Role } from './role.js';

export interface AuthorJson {
    provider_id: string;
    id: string;
    name: string;
    avatar_url: string;
    roles?: RoleJson[];
}

export class Author implements Keyable, Model<AuthorJson> {
    provider_id: string;
    id: string;
    name: string;
    avatar_url: string;
    roles?: Role[];

    constructor(options: {
        provider_id: string;
        id: string;
        name: string;
        avatar_url: string;
        roles?: Role[];
    }) {
        this.provider_id = options.provider_id;
        this.id = options.id;
        this.name = options.name;
        this.avatar_url = options.avatar_url;
        this.roles = options.roles;
    }

    static fromJson(info: AuthorJson): Author {
        return new Author({
            provider_id: info.provider_id,
            id: info.id,
            name: info.name,
            avatar_url: info.avatar_url,
            roles: info.roles?.map(role => new Role(role)),
        });
    }

    key(): string {
        return `${this.provider_id}:${this.id}`;
    }

    toJson(): AuthorJson {
        return {
            provider_id: this.provider_id,
            id: this.id,
            name: this.name,
            avatar_url: this.avatar_url,
            roles: this.roles?.map(role => role.toJson()),
        };
    }

    toString(): string {
        return this.name;
    }
}
