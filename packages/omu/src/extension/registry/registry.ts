export interface Registry<T> {
    get(): Promise<T | undefined>;
    update(fn: (value: T | undefined) => T): Promise<void>;
    listen(fn: (value: T | undefined) => void): Promise<() => void>;
}
