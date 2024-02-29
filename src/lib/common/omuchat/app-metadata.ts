import type { Keyable, Model } from "@omuchatjs/omu/interface.js";

export type AppMetadataJson = {
    identifier: string;
    name: string;
    url: string;
    icon?: string;
}

export class AppMetadata implements Keyable, Model<AppMetadataJson> {
    readonly identifier: string;
    readonly name: string;
    readonly url: string;
    readonly icon?: string;

    constructor(options: {
        identifier: string;
        name: string;
        url: string;
        icon?: string;
    }) {
        this.identifier = options.identifier;
        this.name = options.name;
        this.url = options.url;
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
            name: this.name,
            url: this.url,
            icon: this.icon,
        };
    }
}
