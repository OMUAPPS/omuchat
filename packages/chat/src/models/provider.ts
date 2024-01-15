import type { Keyable, Model } from '@omuchatjs/omu/interface/index.js';

export interface ProviderJson {
    id: string;
    url: string;
    name: string;
    version: string;
    repository_url: string;
    image_url?: string;
    description: string;
    regex: string;
}

export class Provider implements Keyable, Model<ProviderJson> {
    id: string;
    url: string;
    name: string;
    version: string;
    repository_url: string;
    image_url?: string;
    description: string;
    regex: string;

    constructor(json: ProviderJson) {
        this.id = json.id;
        this.url = json.url;
        this.name = json.name;
        this.version = json.version;
        this.repository_url = json.repository_url;
        this.image_url = json.image_url;
        this.description = json.description;
        this.regex = json.regex;
    }
    toString(): string {
        throw new Error('Method not implemented.');
    }

    static fromJson(json: ProviderJson): Provider {
        return new Provider(json);
    }

    key(): string {
        return this.id;
    }

    toJson(): ProviderJson {
        return {
            id: this.id,
            url: this.url,
            name: this.name,
            version: this.version,
            repository_url: this.repository_url,
            image_url: this.image_url,
            description: this.description,
            regex: this.regex,
        };
    }
}
