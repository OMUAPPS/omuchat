import { LOCALES } from "$lib/i18n/locales";
import type { PropedComponent } from "$lib/type/component";
import { writable } from "svelte/store";
import Checkbox from "./settings/Checkbox.svelte";
import Combobox from "./settings/Combobox.svelte";

export const devMode = writable(false);
export const language = writable<keyof typeof LOCALES>("ja-JP");

function getSystemLanguage() {
    if (window.navigator.language in LOCALES) {
        return window.navigator.language;
    }
    for (const lang of window.navigator.languages) {
        if (lang in LOCALES) {
            return lang;
        }
    }
    return "en-US";
}

// TODO: omuchat storage api
export function init() {
    devMode.set(localStorage.getItem('devMode') === 'true');
    language.set(localStorage.getItem('language') as keyof typeof LOCALES || getSystemLanguage());
    devMode.subscribe(value => localStorage.setItem('devMode', value.toString()));
    language.subscribe(value => localStorage.setItem('language', value));
}

setTimeout(init, 0);

export interface Setting<T = any> {
    type: 'boolean' | 'string' | 'number' | 'combo';
    component(): PropedComponent;
}

export const SETTING_REGISTRY: Record<string, Record<string, Setting>> = {
    general: {
        devMode: {
            type: 'boolean',
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
            type: 'combo',
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