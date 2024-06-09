import { Identifier } from './identifier.js';
import type { Keyable } from './interface.js';
import type { Locale } from './localization/locale.js';
import type { LocalizedText } from './localization/localization.js';
import type { Model } from './model.js';

export type AppMetadata = {
    locale: Locale;
    name?: LocalizedText;
    icon?: LocalizedText;
    description?: LocalizedText;
    image?: LocalizedText;
    site?: LocalizedText;
    repository?: LocalizedText;
    authors?: LocalizedText;
    license?: LocalizedText;
    tags?: string[];
}

export type AppJson = {
    id: string;
    version?: string;
    url?: string;
    metadata?: AppMetadata;
}

export class App implements Keyable, Model<AppJson> {
    public readonly id: Identifier;
    public readonly version?: string;
    public readonly url?: string;
    public readonly metadata?: AppMetadata;

    constructor(id: Identifier, options: {
        version?: string;
        url?: string;
        metadata?: AppMetadata;
    }) {
        this.id = id;
        this.version = options.version;
        this.url = options.url;
        this.metadata = options.metadata;
    }

    public key(): string {
        return this.id.key();
    }

    public static fromJson(info: AppJson): App {
        const id = Identifier.fromKey(info.id);
        return new App(id, {
            version: info.version,
            url: info.url,
            metadata: info.metadata,
        });
    }

    public toJson(): AppJson {
        return {
            id: this.id.key(),
            version: this.version,
            url: this.url,
            metadata: this.metadata,
        };
    }
}
