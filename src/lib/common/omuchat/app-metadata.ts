import type { Model } from "@omuchatjs/omu/extension/table/model.js";
import { Identifier } from "@omuchatjs/omu/identifier.js";
import type { Keyable } from "@omuchatjs/omu/interface.js";

export type AppMetadataJson = {
    identifier: string;
    url: string;
    name: string;
    author?: string;
    icon?: string;
}

export class AppMetadata implements Keyable, Model<AppMetadataJson> {
    readonly identifier: Identifier;
    readonly url: string;
    readonly name: string;
    readonly author?: string;
    readonly icon?: string;

    constructor(options: {
        identifier: Identifier;
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
        return this.identifier.key();
    }

    static fromJson(json: AppMetadataJson): AppMetadata {
        return new AppMetadata({
            identifier: Identifier.fromKey(json.identifier),
            url: json.url,
            name: json.name,
            author: json.author,
            icon: json.icon,
        });
    }

    toJson(): AppMetadataJson {
        return {
            identifier: this.identifier.key(),
            url: this.url,
            name: this.name,
            author: this.author,
            icon: this.icon,
        };
    }
}
