import { Writable, writable } from "svelte/store";

type TranslateFunction = (key: string, options?: Record<string, unknown>) => string;

export const translate: Writable<TranslateFunction> = writable((key: string, options?: Record<string, unknown>) => {
    return `(translation for ${key} not found. options: ${JSON.stringify(options)})`;
});
