import type { Keyable } from '@omuchatjs/omu/interface.js';
import type { Model } from '@omuchatjs/omu/model.js';

export type AppMetadataJson = {
    identifier: string;
    url: string;
    name: string;
    author?: string;
    icon?: string;
};

export class AppMetadata implements Keyable, Model<AppMetadataJson> {
    readonly identifier: string;
    readonly url: string;
    readonly name: string;
    readonly author?: string;
    readonly icon?: string;

    constructor(options: {
        identifier: string;
        url: string;
        name: string;
        author?: string;
        icon?: string;
    }) {
        this.identifier = options.identifier;
        this.url = options.url;
        this.name = options.name;
        this.author = options.author;
        this.icon = options.icon;
    }

    key(): string {
        return this.identifier;
    }

    static fromJson(json: AppMetadataJson): AppMetadata {
        return new AppMetadata(json);
    }

    toJson(): AppMetadataJson {
        return {
            identifier: this.identifier,
            url: this.url,
            name: this.name,
            author: this.author,
            icon: this.icon,
        };
    }
}
