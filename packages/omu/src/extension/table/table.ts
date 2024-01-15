import type { Keyable, Model, Serializable } from '../../interface/index.js';
import { Serializer } from '../../interface/index.js';
import type { ExtensionType } from '../extension.js';
import type { App } from '../server/index.js';

import { TableInfo } from './model/table-info.js';

export interface Table<T extends Keyable> {
    readonly info: TableInfo;
    readonly cache: Map<string, T>;
    get(key: string): Promise<T | undefined>;
    getMany(keys: string[]): Promise<Map<string, T>>;
    add(...item: T[]): Promise<void>;
    set(...item: T[]): Promise<void>;
    remove(...items: T[]): Promise<void>;
    clear(): Promise<void>;

    fetch({ before, after, cursor }: { before?: number, after?: number, cursor?: string }): Promise<Map<string, T>>;
    iter({ backward, cursor }: { backward?: boolean, cursor?: string }): AsyncIterable<T>;
    size(): Promise<number>;

    addListener(listener: TableListener<T>): void;
    removeListener(listener: TableListener<T>): void;
    listen(listener?: (items: Map<string, T>) => void): void;
    unlisten(listener?: (items: Map<string, T>) => void): void;

    proxy(proxy: (item: T) => T | null): () => void;
    setCacheSize(size: number): void;
}

export interface TableListener<T extends Keyable> {
    onAdd?(items: Map<string, T>): void;
    onUpdate?(items: Map<string, T>): void;
    onRemove?(items: Map<string, T>): void;
    onClear?(): void;
    onCacheUpdate?(cache: Map<string, T>): void;
}

export interface TableType<T extends Keyable, D = unknown> {
    info: TableInfo;
    key: string;
    serializer: Serializable<T, D>;
}

export class ModelTableType<T extends Keyable & Model<D>, D = unknown> implements TableType<T, D> {
    public readonly info: TableInfo;
    public readonly key: string;
    public readonly serializer: Serializable<T, D>;

    private constructor(
        info: TableInfo,
        model: { fromJson(data: D): T },
    ) {
        this.info = info;
        this.key = info.key();
        this.serializer = Serializer.model(model);
    }

    static of<T extends Keyable & Model<D>, D = unknown>(app: App, {
        name,
        model,
    }: {
        name: string;
        model: { fromJson(data: D): T };
    }): ModelTableType<T, D> {
        return new ModelTableType<T, D>(TableInfo.of(app, { name }), model);
    }

    static ofExtension<T extends Keyable & Model<D>, D = unknown>(extension: ExtensionType, {
        name,
        model,
    }: {
        name: string;
        model: { fromJson(data: D): T };
    }): ModelTableType<T, D> {
        return new ModelTableType<T, D>(TableInfo.ofExtension(extension, { name }), model);
    }
}
