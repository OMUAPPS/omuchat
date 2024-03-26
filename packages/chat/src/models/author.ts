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
    name: string;
    avatar_url?: string;
    roles?: RoleJson[];
    metadata?: AuthorMetadata;
};

export class Author implements Keyable, Model<AuthorJson> {
    providerId: string;
    id: string;
    name: string;
    avatarUrl?: string;
    roles?: Role[];
    metadata?: AuthorMetadata;

    constructor(options: {
        providerId: string;
        id: string;
        name: string;
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
            providerId: info.provider_id,
            id: info.id,
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
            provider_id: this.providerId,
            id: this.id,
            name: this.name,
            avatar_url: this.avatarUrl,
            roles: this.roles?.map((role) => role.toJson()),
            metadata: this.metadata,
        };
    }
}
