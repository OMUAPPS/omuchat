import { RegistryType } from "@omuchatjs/omu/extension/registry/index.js";
import { Identifier } from "@omuchatjs/omu/identifier.js";

const PLUGIN_IDENTIFIER = new Identifier('cc.omuchat', 'plugin-translator');

export type Language = "en" | "es" | "fr" | "de" | "it" | "pt" | "nl" | "pl" | "ru" | "ja" | "zh" | "ko" | "ar";
type TranslatorConfig = {
    active: boolean;
    language: Language;
}

export const CONFIG_REGISTRY_TYPE = RegistryType.createJson<TranslatorConfig>(PLUGIN_IDENTIFIER, {
    name: 'config',
    defaultValue: {
        active: false,
        language: "ja",
    },
});

export const LANGUAGE_OPTIONS: { [key in Language]: { value: Language; label: string } } = {
    en: {
        value: 'en',
        label: 'English',
    },
    es: {
        value: 'es',
        label: 'Español',
    },
    fr: {
        value: 'fr',
        label: 'Français',
    },
    de: {
        value: 'de',
        label: 'Deutsch',
    },
    it: {
        value: 'it',
        label: 'Italiano',
    },
    pt: {
        value: 'pt',
        label: 'Português',
    },
    nl: {
        value: 'nl',
        label: 'Nederlands',
    },
    pl: {
        value: 'pl',
        label: 'Polski',
    },
    ru: {
        value: 'ru',
        label: 'Русский',
    },
    ja: {
        value: 'ja',
        label: '日本語',
    },
    zh: {
        value: 'zh',
        label: '中文',
    },
    ko: {
        value: 'ko',
        label: '한국어',
    },
    ar: {
        value: 'ar',
        label: 'العربية',
    },
};
