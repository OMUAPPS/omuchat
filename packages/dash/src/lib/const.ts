import { writable } from 'svelte/store';

export const dateTimeFormats = writable({
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
