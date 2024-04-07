import { Identifier } from './identifier.js';
import type { Keyable } from './interface.js';
import type { Locale } from './localization/locale.js';
import type { LocalizedText } from './localization/localization.js';
import type { Model } from './model.js';

export type AppLocalization = {
    locale: Locale;
    name?: LocalizedText;
    icon?: LocalizedText;
    description?: LocalizedText;
    image?: LocalizedText;
    site?: LocalizedText;
    repository?: LocalizedText;
    authors?: LocalizedText;
    license?: LocalizedText;
}

export type AppJson = {
    identifier: string;
    version?: string;
    url?: string;
    localizations?: AppLocalization;
}

export class App implements Keyable, Model<AppJson> {
    public readonly identifier: Identifier;
    public readonly version?: string;
    public readonly url?: string;
    public readonly localizations?: AppLocalization;

    constructor(identifier: Identifier, options: {
        version?: string;
        url?: string;
        localizations?: AppLocalization;
    }) {
        this.identifier = identifier;
        this.version = options.version;
        this.url = options.url;
        this.localizations = options.localizations;
    }

    key(): string {
        return this.identifier.key();
    }

    static fromJson(info: AppJson): App {
        const identifier = Identifier.fromKey(info.identifier);
        return new App(identifier, {
            version: info.version,
            url: info.url,
            localizations: info.localizations,
        });
    }

    toJson(): AppJson {
        return {
            identifier: this.identifier.key(),
            version: this.version,
            url: this.url,
            localizations: this.localizations,
        };
    }
}
