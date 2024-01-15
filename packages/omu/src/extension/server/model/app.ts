import type { Keyable, Model } from '../../../interface/index.js';

export interface AppJson {
    name: string;
    group: string;
    version: string;
    description?: string;
    authors?: string[];
    site_url?: string;
    repository_url?: string;
    license?: string;
    image_url?: string;
}

export class App implements Keyable, Model<AppJson> {
    name: string;
    group: string;
    version: string;
    description?: string;
    authors?: string[];
    site_url?: string;
    repository_url?: string;
    license?: string;
    image_url?: string;

    constructor(info: AppJson) {
        this.name = info.name;
        this.group = info.group;
        this.version = info.version;
        this.description = info.description;
        this.authors = info.authors;
        this.site_url = info.site_url;
        this.repository_url = info.repository_url;
        this.license = info.license;
        this.image_url = info.image_url;
    }

    static fromJson(info: AppJson): App {
        return new App(info);
    }

    key(): string {
        return `${this.group}/${this.name}`;
    }

    toJson(): AppJson {
        return {
            name: this.name,
            group: this.group,
            version: this.version,
            description: this.description,
            authors: this.authors,
            site_url: this.site_url,
            repository_url: this.repository_url,
            license: this.license,
            image_url: this.image_url,
        };
    }

    toString(): string {
        return `${this.group}/${this.name} v${this.version}`;
    }
}
