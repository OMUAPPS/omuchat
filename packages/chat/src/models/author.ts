import { Identifier } from '@omuchatjs/omu/identifier.js';
import type { Keyable } from '@omuchatjs/omu/interface.js';
import type { Model } from '@omuchatjs/omu/model.js';

import type { RoleJson } from './role.js';
import { Role } from './role.js';

export type AuthorMetadata = {
    url?: string;
    screen_id?: string;
    avatar_url?: string;
    description?: string;
    links?: string[];
};

export type AuthorJson = {
    provider_id: string;
    id: string;
    name?: string;
    avatar_url?: string;
    roles?: RoleJson[];
    metadata?: AuthorMetadata;
};

export class Author implements Keyable, Model<AuthorJson> {
    public providerId: Identifier;
    public id: Identifier;
    public name?: string;
    public avatarUrl?: string;
    public roles?: Role[];
    public metadata?: AuthorMetadata;

    constructor(options: {
        providerId: Identifier;
        id: Identifier;
        name?: string;
        avatarUrl?: string;
        roles?: Role[];
        metadata?: AuthorMetadata;
    }) {
        this.providerId = options.providerId;
        this.id = options.id;
        this.name = options.name;
        this.avatarUrl = options.avatarUrl;
        this.roles = options.roles;
        this.metadata = options.metadata;
    }

    static fromJson(info: AuthorJson): Author {
        return new Author({
            providerId: Identifier.fromKey(info.provider_id),
            id: Identifier.fromKey(info.id),
            name: info.name,
            avatarUrl: info.avatar_url,
            roles: info.roles?.map((role) => Role.fromJson(role)),
            metadata: info.metadata,
        });
    }

    key(): string {
        return `${this.providerId}:${this.id}`;
    }

    toJson(): AuthorJson {
        return {
            provider_id: this.providerId.key(),
            id: this.id.key(),
            name: this.name,
            avatar_url: this.avatarUrl,
            roles: this.roles?.map((role) => role.toJson()),
            metadata: this.metadata,
        };
    }
}
