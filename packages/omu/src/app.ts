import { Identifier } from './identifier.js';
import type { Keyable } from './interface.js';
import type { Model } from './model.js';

export interface AppJson {
    identifier: string;
    version?: string;
    description?: string;
    authors?: string[];
    site_url?: string;
    repository_url?: string;
    license?: string;
    image_url?: string;
}

export class App implements Keyable, Model<AppJson> {
    public readonly identifier: Identifier;
    public readonly name: string;
    public readonly group: string;
    public version?: string;
    public description?: string;
    public authors?: string[];
    public siteUrl?: string;
    public repositoryUrl?: string;
    public license?: string;
    public imageUrl?: string;

    constructor(identifier: Identifier, options: {
        version?: string;
        description?: string;
        authors?: string[];
        siteUrl?: string;
        repositoryUrl?: string;
        license?: string;
        imageUrl?: string;
    }) {
        this.identifier = identifier;
        this.name = identifier.path.join('/');
        this.group = identifier.namespace;
        this.version = options.version;
        this.description = options.description;
        this.authors = options.authors;
        this.siteUrl = options.siteUrl;
        this.repositoryUrl = options.repositoryUrl;
        this.license = options.license;
        this.imageUrl = options.imageUrl;
    }

    key(): string {
        return this.identifier.key();
    }

    static fromJson(info: AppJson): App {
        const identifier = Identifier.fromKey(info.identifier);
        return new App(identifier, {
            version: info.version,
            description: info.description,
            authors: info.authors,
            siteUrl: info.site_url,
            repositoryUrl: info.repository_url,
            license: info.license,
            imageUrl: info.image_url,
        });
    }

    toJson(): AppJson {
        return {
            identifier: this.key(),
            version: this.version,
            description: this.description,
            authors: this.authors,
            site_url: this.siteUrl,
            repository_url: this.repositoryUrl,
            license: this.license,
            image_url: this.imageUrl,
        };
    }
}
