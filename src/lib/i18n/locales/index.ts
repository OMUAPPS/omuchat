import { createI18n, type I18n } from '../i18n';

export interface Entry {
    name: string;
    load: () => Promise<I18n>;
}

async function loadI18n(load: () => any, locale: string): Promise<I18n> {
    const { default: messages } = await load();
    return createI18n(messages, locale);
}

export const LOCALES = {
    'ja-JP': {
        name: '日本語',
        load: () => loadI18n(() => import('./ja-JP.json'), 'ja-JP')
    }
};
