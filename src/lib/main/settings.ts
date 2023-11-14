import { writable } from 'svelte/store';

import Checkbox from './settings/Checkbox.svelte';
import Combobox from './settings/Combobox.svelte';

import type { PropedComponent } from '$lib/common/component/proped-component';
import { LOCALES } from '$lib/i18n/locales';

function getSystemLanguage(): keyof typeof LOCALES {
    if (window.navigator.language in LOCALES) {
        return window.navigator.language as keyof typeof LOCALES;
    }
    for (const lang of window.navigator.languages) {
        if (lang in LOCALES) {
            return lang as keyof typeof LOCALES;
        }
    }
    return 'en-US';
}

// TODO: omuchat storage apiに移行
export function createSetting<T>(
    key: string,
    serializer: (value: T) => string,
    deserializer: (value: string) => T,
    defaultValue: T
) {
    const store = writable<T>(
        localStorage.getItem(key) ? deserializer(localStorage.getItem(key)!) : defaultValue
    );
    store.subscribe((value) => localStorage.setItem(key, serializer(value)));
    return store;
}

function createBooleanSetting(key: string, defaultValue: boolean) {
    return createSetting(
        key,
        (value) => value.toString(),
        (value) => value === 'true',
        defaultValue
    );
}

function createStringSetting(key: string, defaultValue: string) {
    return createSetting(
        key,
        (value) => value,
        (value) => value,
        defaultValue
    );
}

function createLiteralSetting<T extends string>(key: string, defaultValue: T) {
    return createSetting(
        key,
        (value) => value,
        (value) => value as T,
        defaultValue
    );
}

export const devMode = createBooleanSetting('devMode', false);
export const language = createLiteralSetting<keyof typeof LOCALES>('language', getSystemLanguage());
export const currentPage = createStringSetting('currentPage', 'main');

export interface Setting {
    component(): PropedComponent;
}

// 無駄な労力ジェネレーター2021
function calcLanguageScore(lang: string): number {
    let score = 0;
    score +=
        window.navigator.languages.indexOf(lang) === -1
            ? 0
            : window.navigator.languages.indexOf(lang);
    score = window.navigator.language === lang ? 100 : 0;
    ['en', 'zh', 'fr', 'de', 'it', 'pt', 'ro', 'ru', 'ro', 'es', 'sv'].forEach((pair) => {
        if (lang.startsWith(pair) && window.navigator.language.startsWith(pair)) {
            score += 10;
        }
    });

    return score;
}

export const SETTING_REGISTRY: Record<string, Record<string, Setting>> = {
    general: {
        devMode: {
            component() {
                return {
                    component: Checkbox,
                    props: {
                        label: 'settings.setting.devMode',
                        value: devMode
                    }
                };
            }
        }
    },
    language: {
        language: {
            component() {
                return {
                    component: Combobox,
                    props: {
                        label: 'settings.setting.language',
                        value: language,
                        options: Object.keys(LOCALES).sort(
                            (a, b) => calcLanguageScore(b) - calcLanguageScore(a)
                        ) as (keyof typeof LOCALES)[]
                    }
                };
            }
        }
    }
};
