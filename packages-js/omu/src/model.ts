export interface Model<T> {
    toJson(): T;
    toString(): string;
}
