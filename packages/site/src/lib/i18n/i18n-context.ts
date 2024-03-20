import { writable, type Writable } from 'svelte/store';

import type { I18n, TranslateFunction } from './i18n.js';

export const i18n: Writable<I18n | null> = writable(null);

export const t: Writable<TranslateFunction> = writable(() => {
    throw new Error('i18n is not initialized');
});

i18n.subscribe((i18n) => {
    if (i18n) {
        t.set(i18n.translate);
    }
});
