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
    'ja-JP': {
        name: '日本語',
        load: () => loadI18n('./ja-JP.json')
    },
    'ja-JP-hiragana': {
        name: 'ひらがな',
        load: () => loadI18n('./ja-JP-hiragana.json')
    },
    'en-US': {
        name: 'English (US)',
        load: () => loadI18n('./en-US.json')
    },
    'ar-EG': {
        name: 'العربية',
        load: () => loadI18n('./ar-EG.json')
    },
    'zh-CN': {
        name: '简体中文',
        load: () => loadI18n('./zh-CN.json')
    },
};
