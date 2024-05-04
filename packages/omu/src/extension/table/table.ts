import { EventEmitter } from '../../event-emitter.js';
import type { Identifier } from '../../identifier.js';
import type { Keyable } from '../../interface.js';
import type { Model } from '../../model.js';
import type { Serializable } from '../../serializer.js';
import { Serializer } from '../../serializer.js';
import type { ExtensionType } from '../extension.js';

export type TableConfig = {
    cache_size: number;
};

export interface Table<T> {
    readonly cache: ReadonlyMap<string, T>;
    readonly listeners: TableListeners<T>;
    get(key: string): Promise<T | undefined>;
    getMany(...keys: string[]): Promise<Map<string, T>>;
    add(...item: T[]): Promise<void>;
    update(...item: T[]): Promise<void>;
    remove(...items: T[]): Promise<void>;
    clear(): Promise<void>;

    fetchItems({
        before,
        after,
        cursor,
    }: {
        before?: number;
        after?: number;
        cursor?: string;
    }): Promise<Map<string, T>>;
    fetchAll(): Promise<Map<string, T>>;
    iterate({ backward, cursor }: { backward?: boolean; cursor?: string }): AsyncIterable<T>;
    size(): Promise<number>;

    proxy(proxy: (item: T) => T | undefined): () => void;
    setCacheSize(size: number): void;
    setConfig(config: TableConfig): void;
    setPermissions(permissions: TablePermissions): void;

    listen(listener?: (items: Map<string, T>) => void): () => void;
}

export class TableListeners<T> {
    public readonly add = new EventEmitter<(items: Map<string, T>) => void>();
    public readonly update = new EventEmitter<(items: Map<string, T>) => void>();
    public readonly remove = new EventEmitter<(items: Map<string, T>) => void>();
    public readonly clear = new EventEmitter<() => void>();
    public readonly cacheUpdate = new EventEmitter<(items: Map<string, T>) => void>();
}

export type TablePermissions = {
    all?: Identifier;
    read?: Identifier;
    write?: Identifier;
    remove?: Identifier;
    proxy?: Identifier;
};

export class TableType<T> {
    constructor(
        public identifier: Identifier,
        public serializer: Serializable<T, Uint8Array>,
        public keyFunction: (item: T) => string,
        public permissions?: TablePermissions,
    ) { }

    public static createModel<T extends Keyable & Model<D>, D = unknown>(
        identifier: Identifier | ExtensionType,
        {
            name,
            model,
            permissions,
        }: {
            name: string;
            model: { fromJson(data: D): T };
            permissions?: TablePermissions;
        },
    ): TableType<T> {
        return new TableType<T>(
            identifier.join(name),
            Serializer.model(model).pipe(Serializer.json()),
            (item) => item.key(),
            permissions,
        );
    }
}
