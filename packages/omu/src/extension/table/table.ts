import { Identifier } from '../../identifier.js';
import type { Keyable } from '../../interface.js';
import { Serializable, Serializer } from '../../serializer.js';
import type { ExtensionType } from '../extension.js';
import type { App } from '../server/index.js';
import type { Model } from '../../model.js';

export type TableConfig = {
    cache_size: number;
};

export interface Table<T> {
    readonly cache: Map<string, T>;
    get(key: string): Promise<T | undefined>;
    getMany(keys: string[]): Promise<Map<string, T>>;
    add(...item: T[]): Promise<void>;
    set(...item: T[]): Promise<void>;
    remove(...items: T[]): Promise<void>;
    clear(): Promise<void>;

    fetch({
        before,
        after,
        cursor,
    }: {
        before?: number;
        after?: number;
        cursor?: string;
    }): Promise<Map<string, T>>;
    iter({ backward, cursor }: { backward?: boolean; cursor?: string }): AsyncIterable<T>;
    size(): Promise<number>;

    proxy(proxy: (item: T) => T | undefined): () => void;
    setCacheSize(size: number): void;
    setConfig(config: TableConfig): void;

    addListener(listener: TableListener<T>): void;
    removeListener(listener: TableListener<T>): void;
    listen(listener?: (items: Map<string, T>) => void): () => void;
    unlisten(listener?: (items: Map<string, T>) => void): void;
}

export interface TableListener<T> {
    onAdd?(items: Map<string, T>): void;
    onUpdate?(items: Map<string, T>): void;
    onRemove?(items: Map<string, T>): void;
    onClear?(): void;
    onCacheUpdate?(cache: Map<string, T>): void;
}

export class TableType<T> {
    constructor(
        public identifier: Identifier,
        public serializer: Serializable<T, Uint8Array>,
        public keyFunc: (item: T) => string,
    ) { }

    static model<T extends Keyable & Model<D>, D = unknown>(
        identifier: Identifier | ExtensionType,
        {
            name,
            model,
        }: {
            name: string;
            model: { fromJson(data: D): T };
        },
    ): TableType<T> {
        return new TableType<T>(
            identifier.join(name),
            Serializer.model(model).pipe(Serializer.json()),
            (item) => item.key(),
        );
    }
}
