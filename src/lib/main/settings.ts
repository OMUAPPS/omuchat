import { LOCALES } from "$lib/i18n/locales";
import type { PropedComponent } from "$lib/type/component";
import { writable } from "svelte/store";
import Checkbox from "./settings/Checkbox.svelte";
import Combobox from "./settings/Combobox.svelte";

export const devMode = writable(false);
export const language = writable<keyof typeof LOCALES>("ja-JP");

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
                        label: 'Dev mode',
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
                        label: 'Language',
                        value: language,
                        options: Object.keys(LOCALES) as (keyof typeof LOCALES)[]
                    }
                }
            }
        }
    }
}