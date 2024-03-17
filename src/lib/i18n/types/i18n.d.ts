export interface I18n {
    translate: TranslateFunction;
    locale: string;
}

export type Messages = {
    [key: string]: string | Messages;
}

export interface Entry {
    name: string;
    load: () => Promise<I18n>;
}

export type TranslateFunction = (key: string, params?: Record<string, unknown>) => string;