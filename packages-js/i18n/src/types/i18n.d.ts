export type I18n = {
    translate: TranslateFunction;
    localeName: string;
}

export type Translations = {
    [key: string]: string | Translations;
}

export type TranslateFunction = (key: string, params?: Record<string, string>) => string;

type Unconstrained<T, U extends T = T> = U;

export type I18nKeys<T extends Translations> = Unconstrained<
    { [K in keyof T]: T[K] extends Translations ? I18nKeys<T[K]> : string }
>;
