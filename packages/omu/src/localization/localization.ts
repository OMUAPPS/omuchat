import type { Locale } from './locale.js';

export type LocalizedText = {
    [key in Locale]?: string;
} | string;

export interface Translations {
    [key: string]: Translations | LocalizedText;
}
