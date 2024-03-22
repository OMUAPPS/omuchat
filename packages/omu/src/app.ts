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
    public site_url?: string;
    public repository_url?: string;
    public license?: string;
    public image_url?: string;

    constructor(identifier: Identifier, options: {
        version?: string;
        description?: string;
        authors?: string[];
        site_url?: string;
        repository_url?: string;
        license?: string;
        image_url?: string;
    }) {
        this.identifier = identifier;
        this.name = identifier.path.join('/');
        this.group = identifier.namespace;
        this.version = options.version;
        this.description = options.description;
        this.authors = options.authors;
        this.site_url = options.site_url;
        this.repository_url = options.repository_url;
        this.license = options.license;
        this.image_url = options.image_url;
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
            site_url: info.site_url,
            repository_url: info.repository_url,
            license: info.license,
            image_url: info.image_url,
        });
    }

    toJson(): AppJson {
        return {
            identifier: this.key(),
            version: this.version,
            description: this.description,
            authors: this.authors,
            site_url: this.site_url,
            repository_url: this.repository_url,
            license: this.license,
            image_url: this.image_url,
        };
    }
}
