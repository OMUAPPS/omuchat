import { LOCALES } from "$lib/i18n/locales";
import type { PropedComponent } from "$lib/type/component";
import { writable } from "svelte/store";
import Checkbox from "./settings/Checkbox.svelte";
import Combobox from "./settings/Combobox.svelte";


function getSystemLanguage(): keyof typeof LOCALES {
    if (window.navigator.language in LOCALES) {
        return window.navigator.language as keyof typeof LOCALES;
    }
    for (const lang of window.navigator.languages) {
        if (lang in LOCALES) {
            return lang as keyof typeof LOCALES;
        }
    }
    return "en-US";
}

// TODO: omuchat storage apiに移行
export function createSetting<T>(key: string, serializer: (value: T) => string, deserializer: (value: string) => T, defaultValue: T) {
    const store = writable<T>(localStorage.getItem(key) ? deserializer(localStorage.getItem(key)!) : defaultValue);
    store.subscribe(value => localStorage.setItem(key, serializer(value)));
    return store;
}

function createBooleanSetting(key: string, defaultValue: boolean) {
    return createSetting(key, value => value.toString(), value => value === 'true', defaultValue);
}

function createNumberSetting(key: string, defaultValue: number) {
    return createSetting(key, value => value.toString(), value => Number(value), defaultValue);
}

function createStringSetting(key: string, defaultValue: string) {
    return createSetting(key, value => value, value => value, defaultValue);
}

function createLiteralSetting<T extends string>(key: string, defaultValue: T) {
    return createSetting(key, value => value, value => value as T, defaultValue);
}

export const devMode = createBooleanSetting('devMode', false);
export const language = createLiteralSetting<keyof typeof LOCALES>('language', getSystemLanguage());
export const currentPage = createStringSetting('currentPage', 'main');

export interface Setting {
    component(): PropedComponent;
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
                }
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
                        options: Object.keys(LOCALES) as (keyof typeof LOCALES)[]
                    }
                }
            }
        }
    }
}