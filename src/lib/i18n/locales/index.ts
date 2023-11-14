import { createI18n, type I18n } from '../i18n';

export interface Entry {
    name: string;
    load: () => Promise<I18n>;
}

async function loadI18n(path: string): Promise<I18n> {
    const { default: messages } = await import(path /* @vite-ignore */);
    return createI18n(messages, path);
}

export const LOCALES = {
    'en-US': {
        name: 'English (US)',
        load: () => loadI18n('./en-US.json')
    },
    'ja-JP': {
        name: '日本語',
        load: () => loadI18n('./ja-JP.json'),
    },
}
