import type { Client } from '../../client/client.js';
import type { Locale } from '../../localization/locale.js';
import type { LocalizedText } from '../../localization/localization.js';
import type { Extension } from '../extension.js';
import { ExtensionType } from '../extension.js';
import type { Registry } from '../registry/registry.js';
import { RegistryType } from '../registry/registry.js';

export const I18N_EXTENSION_TYPE = new ExtensionType('i18n', (client) => new I18nExtension(client));

const LOCALE_REGISTRY = RegistryType.createJson<Locale[]>(I18N_EXTENSION_TYPE, {
    name: 'locale',
    defaultValue: [],
});

export class I18nExtension implements Extension {
    private readonly localeRegistry: Registry<Locale[]>;
    public locale?: Locale[];

    constructor(private readonly client: Client) {
        this.localeRegistry = client.registry.get(LOCALE_REGISTRY);
        this.localeRegistry.listen((locale) => {
            this.locale = locale;
        });
        client.network.addTask(async () => {
            const locale = await this.localeRegistry.get();
            this.locale = locale;
        });
    }

    translate(localizedText: LocalizedText): string {
        if (!this.locale) {
            throw new Error('Locale not set');
        }
        if (typeof localizedText === 'string') {
            return localizedText;
        }
        const translation = this.selectBestTranslation(localizedText);
        if (!translation) {
            throw new Error(`Missing translation for ${this.locale} in ${JSON.stringify(localizedText)}`);
        }
        return translation;
    }

    private selectBestTranslation(localizedText: LocalizedText): string | undefined {
        if (typeof localizedText === 'string') {
            return localizedText;
        }
        const locale = this.locale;
        if (!locale) {
            throw new Error('Locale not set');
        }
        const translations = localizedText;
        const locales = locale.reduce((acc, l) => {
            const parts = l.split('-');
            for (let i = parts.length; i > 0; i--) {
                acc.push(parts.slice(0, i).join('-'));
            }
            return acc;
        }, [] as string[]);
        for (const l of locales) {
            const translation = translations[l];
            if (translation) {
                return translation;
            }
        }
        return undefined;
    }

    setLocale(locale: Locale[]): Promise<void> {
        return this.localeRegistry.set(locale);
    }
}
