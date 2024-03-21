import type { Client } from "@omuchatjs/omu";
import { writable, type Writable } from "svelte/store";

type TranslateFunction = (key: string, options?: Record<string, unknown>) => string;

export const translate: Writable<TranslateFunction> = writable((key: string, options?: Record<string, unknown>) => {
    return `(translation for ${key} not found. options: ${JSON.stringify(options)})`;
});

export const client: Writable<Client> = writable();

export function setClient<T extends Client>(newClient: T): T {
    client.set(newClient);
    return newClient;
}

type Theme = {
    [key: string]: string;
}

export const theme: Writable<Theme> = writable({
    '--color-bg-1': '#f6f3eb',
    '--color-bg-2': '#fffefc',
    '--color-1': '#0b6f72',
    '--color-2': '#35dfe1',
    '--color-text': '#444',
    '--color-outline': 'rgba(0, 0, 0, 0.1)',
    '--margin': '10px',
});
