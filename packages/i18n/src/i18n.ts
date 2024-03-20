export interface I18n {
    translate: TranslateFunction;
    locale: string;
}

export type Messages = {
    [key: string]: string | Messages;
}

export interface Entry {
    name: string;
    load: () => Promise<I18n>;
}

export type TranslateFunction = (key: string, params?: Record<string, unknown>) => string;

export function createI18n(messages: Messages, locale: string): I18n {
    function getTranslation(key: string): string {
        const parts = key.split('.');
        let translation: string | undefined;
        let result = messages;
        for (const part of parts) {
            if (typeof result !== 'object') return key;
            translation = result[part] as string | undefined;
            result = result[part] as Messages;
        }
        if (typeof translation === 'object') {
            translation = translation[''];
        }
        if (!translation) return key;
        return translation;
    }

    const translate = (key: string, params?: Record<string, unknown>): string => {
        const translation = getTranslation(key);
        if (!translation) {
            console.warn(`Translation for key "${key}" not found`);
            return key;
        }
        if (params) {
            return translation.replace(/\{([a-zA-Z0-9]+)\}/g, (_, key) => params[key] ?? key);
        }
        return translation;
    };

    return {
        locale,
        translate,
    };
}

export function createI18nUnion(i18Array: I18n[]): I18n {
    const localizedItems = Array.from(i18Array);
    const locales = `union(${localizedItems.map((i18n) => i18n.locale).join(', ')})`;
    const translate = (key: string, params?: Record<string, unknown>): string => {
        for (const i18n of localizedItems) {
            const translated = i18n.translate(key, params);
            if (translated !== key) return translated;
        }
        return key;
    };

    return {
        translate,
        locale: locales,
    };
}

export async function loadI18n(load: () => Promise<{ default: Messages }>, locale: string): Promise<I18n> {
    const { default: messages } = await load();
    return createI18n(messages, locale);
}
