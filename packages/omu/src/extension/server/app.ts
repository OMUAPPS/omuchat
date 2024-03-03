import { Identifier } from '../../identifier.js';
import type { Keyable } from '../../interface.js';
import type { Model } from '../table/model.js';

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
    readonly name: string;
    readonly group: string;
    version?: string;
    description?: string;
    authors?: string[];
    site_url?: string;
    repository_url?: string;
    license?: string;
    image_url?: string;

    constructor(options: {
        name: string;
        group: string;
        version?: string;
        description?: string;
        authors?: string[];
        site_url?: string;
        repository_url?: string;
        license?: string;
        image_url?: string;
    }) {
        this.name = options.name;
        this.group = options.group;
        this.version = options.version;
        this.description = options.description;
        this.authors = options.authors;
        this.site_url = options.site_url;
        this.repository_url = options.repository_url;
        this.license = options.license;
        this.image_url = options.image_url;
    }

    static fromIdentifier(identifier: Identifier, options: {
        version?: string;
        description?: string;
        authors?: string[];
        site_url?: string;
        repository_url?: string;
        license?: string;
        image_url?: string;
    }): App {
        return new App({
            name: identifier.name,
            group: identifier.namespace,
            version: options.version,
            description: options.description,
            authors: options.authors,
            site_url: options.site_url,
            repository_url: options.repository_url,
            license: options.license,
            image_url: options.image_url,
        });
    }

    key(): string {
        return Identifier.format(this.group, this.name);
    }

    static fromJson(info: AppJson): App {
        const identifier = Identifier.fromKey(info.identifier);
        return new App({
            name: identifier.name,
            group: identifier.namespace,
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
