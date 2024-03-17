import { createI18n } from './i18n.js';
import { type Messages, type I18n } from "./types/i18n.d.js";

async function loadI18n(load: () => Promise<{ default: Messages }>, locale: string): Promise<I18n> {
    const { default: messages } = await load();
    return createI18n(messages, locale);
}

export const LOCALES = {
    'ja-JP': {
        name: '日本語',
        load: () => loadI18n(() => import('./locales/ja-JP.json'), 'ja-JP'),
    },
};

export const DEFAULT_LOCALE = 'ja-JP';