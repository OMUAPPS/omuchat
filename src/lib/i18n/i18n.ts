import { type Messages, type I18n } from "./types/i18n.d.js";

export function createI18n(messages: Messages, locale: string): I18n {
    function getTranslation(key: string) {
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
    };

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
    }

    return {
        locale,
        translate,
    };
}

export function createI18nUnion(i18ns: I18n[]): I18n {
    const translate = (key: string, params?: Record<string, unknown>): string => {
        for (const i18n of i18ns) {
            const translated = i18n.translate(key, params);
            if (translated !== key) return translated;
        }
        return key;
    }

    return {
        translate,
        get locale(): string {
            const locales = i18ns.map((i18n) => i18n.locale).join(', ');
            return `union(${locales})`;
        },
    };
}
