export interface I18n {
    translate: TranslateFunction;
    localeName: string;
}

export type Translations = {
    [key: string]: string | Translations;
}

export type TranslateFunction = (key: string, params?: Record<string, string>) => string;

export function createI18n(translations: Translations, localeName: string): I18n {
    function getTranslation(key: string): string {
        const parts = key.split('.');
        let translation: string | undefined;
        let result = translations;
        for (const part of parts) {
            if (typeof result !== 'object') return key;
            translation = result[part] as string | undefined;
            result = result[part] as Translations;
        }
        if (typeof translation === 'object') {
            translation = translation[''];
        }
        if (!translation) return key;
        return translation;
    }

    function translate(key: string, params?: Record<string, string>): string {
        const translation = getTranslation(key);
        if (!translation) {
            console.warn(`Translation for key "${key}" not found`);
            return key;
        }
        if (params) {
            return translation.replace(/\{([a-zA-Z0-9]+)\}/g, (_, key) => params[key] || key);
        }
        return translation;
    }

    return {
        localeName: localeName,
        translate,
    };
}

export function createI18nUnion(i18Array: I18n[]): I18n {
    const localizedItems = Array.from(i18Array);
    const localeName = `union(${localizedItems.map((i18n) => i18n.localeName).join(', ')})`;

    function translate(key: string, params?: Record<string, string>): string {
        for (const i18n of localizedItems) {
            const translated = i18n.translate(key, params);
            if (translated !== key) return translated;
        }
        return key;
    }

    return {
        translate,
        localeName: localeName,
    };
}

export async function loadI18n(load: () => Promise<{ default: Translations }>, locale: string): Promise<I18n> {
    const { default: translations } = await load();
    return createI18n(translations, locale);
}
