export interface Model<T extends any> {
    toJson(): T;
    toString(): string;
}
