import type { Chat } from '@omuchatjs/chat';
import type { Client } from '@omuchatjs/omu/client.js';
import type { Locale } from '@omuchatjs/omu/localization/index.js';
import { BROWSER } from 'esm-env';
import { writable, type Writable } from 'svelte/store';

type TranslateFunction = (key: string, options?: Record<string, string>) => string;

export const translate: Writable<TranslateFunction> = writable(
    (key: string, options?: Record<string, unknown>) => {
        return `(translation for ${key} not found. options: ${JSON.stringify(options)})`;
    },
);

export const client: Writable<Client> = writable();
export const chat: Writable<Chat> = writable();

export function setClient<T extends Client>(newClient: T): T {
    client.set(newClient);
    if (BROWSER) {
        newClient.i18n.locales = window.navigator.languages as Locale[];
    }
    return newClient;
}
export function setChat<T extends Chat>(newChat: T): T {
    chat.set(newChat);
    return newChat;
}

type Theme = {
    [key: string]: string;
};

export const theme: Writable<Theme> = writable({
    '--color-bg-1': '#f6f3eb',
    '--color-bg-2': '#fffefc',
    '--color-1': '#0b6f72',
    '--color-2': '#35dfe1',
    '--color-text': '#444',
    '--color-outline': 'rgba(0, 0, 0, 0.1)',
    '--margin': '10px',
});

export const dateTimeFormats = writable<{
    full: Intl.DateTimeFormat;
    short: Intl.DateTimeFormat;
    time: Intl.DateTimeFormat;
}>();

if (BROWSER) {
    dateTimeFormats.set({
        full: new Intl.DateTimeFormat(window.navigator.language, {
            dateStyle: 'full',
            timeStyle: 'long',
            hour12: false,
        }),
        short: new Intl.DateTimeFormat(window.navigator.language, {
            dateStyle: 'short',
            timeStyle: 'short',
            hour12: false,
        }),
        time: new Intl.DateTimeFormat(window.navigator.language, {
            timeStyle: 'short',
            hour12: false,
        }),
    });
}
