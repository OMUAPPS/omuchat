import type { Model } from './model.js';

export interface Serializable<T, D> {
    serialize(data: T): D;
    deserialize(data: D): T;
}

export class Serializer<T, D> {
    constructor(
        public serialize: (data: T) => D,
        public deserialize: (data: D) => T,
    ) {}

    static noop<T>(): Serializable<T, T> {
        return new Serializer<T, T>((data) => data, (data) => data);
    }

    static model<M extends Model<D>, D>(model: { fromJson(data: D): M }): Serializable<M, D> {
        return new Serializer<M, D>((data) => data.toJson(), model.fromJson);
    }

    static array<T, D>(serializer: Serializable<T, D>): Serializable<T[], D[]> {
        return new Serializer<T[], D[]>(
            (data) => data.map((item) => serializer.serialize(item)),
            (data) => data.map((item) => serializer.deserialize(item)),
        );
    }

    static map<V, D>(serializer: Serializable<V, D>): Serializable<Map<string, V>, Map<string, D>> {
        return new Serializer<Map<string, V>, Map<string, D>>(
            (data) => {
                const result = new Map<string, D>();
                data.forEach((value, key) => {
                    result.set(key, serializer.serialize(value));
                });
                return result;
            },
            (data) => {
                const result = new Map<string, V>();
                data.forEach((value, key) => {
                    result.set(key, serializer.deserialize(value));
                });
                return result;
            },
        );
    }
}
