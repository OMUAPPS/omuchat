import { createI18n, type I18n, type Messages } from '../i18n.js';

export interface Entry {
    name: string;
    load: () => Promise<I18n>;
}

async function loadI18n(load: () => Promise<{ default: Messages }>, locale: string): Promise<I18n> {
    const { default: messages } = await load();
    return createI18n(messages, locale);
}

export const LOCALES = {
    'ja-JP': {
        name: '日本語',
        load: () => loadI18n(() => import('./ja-JP.json'), 'ja-JP'),
    },
};

export const DEFAULT_LOCALE = 'ja-JP';
