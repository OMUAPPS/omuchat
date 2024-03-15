export interface Registry<T> {
    get(): Promise<T>;
    update(fn: (value: T) => T): Promise<void>;
    listen(fn: (value: T) => void): () => void;
}
