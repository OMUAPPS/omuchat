/// <reference types="svelte" />
import { type Writable } from 'svelte/store';
type TranslateFunction = (key: string, options?: Record<string, unknown>) => string;
export declare const translate: Writable<TranslateFunction>;
export {};
