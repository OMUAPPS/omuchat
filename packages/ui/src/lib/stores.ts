import type { Client } from "@omuchatjs/omu";
import { writable, type Writable } from "svelte/store";

type TranslateFunction = (key: string, options?: Record<string, unknown>) => string;

export const translate: Writable<TranslateFunction> = writable((key: string, options?: Record<string, unknown>) => {
    return `(translation for ${key} not found. options: ${JSON.stringify(options)})`;
});

export const client: Writable<Client> = writable();
