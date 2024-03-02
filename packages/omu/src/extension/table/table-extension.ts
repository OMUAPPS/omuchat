import { Keyable } from '../../interface.js';
import type { Client } from '../../client/index.js';
import { JsonEventType, SerializeEventType } from '../../event/event.js';
import { ByteReader, ByteWriter } from '../../helper.js';
import { Serializer } from '../../serializer.js';
import { JsonEndpointType, SerializeEndpointType } from '../endpoint/endpoint.js';
import type { Extension, ExtensionType } from '../extension.js';
import { defineExtensionType } from '../extension.js';

import { TableInfo } from './table-info.js';
import type { Table, TableListener, TableType } from './table.js';
import { ModelTableType } from './table.js';

export const TableExtensionType: ExtensionType<TableExtension> = defineExtensionType('table', {
    create: (client: Client) => new TableExtension(client),
});
type TableEventData = { type: string; }
type TableItemsData = TableEventData & { items: Record<string, Uint8Array> };
type TableProxyData = TableEventData & { items: Record<string, Uint8Array>, key: number };

const itemsSerializer = new Serializer<TableItemsData, Uint8Array>(
    (data) => {
        const writer = new ByteWriter();
        writer.writeString(data.type);
        writer.writeInt(Object.keys(data.items).length);
        for (const [key, value] of Object.entries(data.items)) {
            writer.writeString(key);
            writer.writeByteArray(value);
        }
        return writer.finish();
    },
    (data) => {
        const reader = new ByteReader(data);
        const type = reader.readString();
        const itemCount = reader.readInt();
        const items = {};
        for (let i = 0; i < itemCount; i++) {
            const key = reader.readString();
            const value = reader.readByteArray();
            items[key] = value;
        }
        reader.finish();
        return { type, items };
    },
);
const proxySerializer = new Serializer<TableProxyData, Uint8Array>(
    (data) => {
        const writer = new ByteWriter();
        writer.writeString(data.type);
        writer.writeInt(data.key);
        writer.writeInt(Object.keys(data.items).length);
        for (const [key, value] of Object.entries(data.items)) {
            writer.writeString(key);
            writer.writeByteArray(value);
        }
        return writer.finish();
    },
    (data) => {
        const reader = new ByteReader(data);
        const type = reader.readString();
        const key = reader.readInt();
        const itemCount = reader.readInt();
        const items = {};
        for (let i = 0; i < itemCount; i++) {
            const key = reader.readString();
            const value = reader.readByteArray();
            items[key] = value;
        }
        reader.finish();
        return { type, key, items };
    },
);

export const TableRegisterEvent = JsonEventType.ofExtension<TableInfo>(TableExtensionType, {
    name: 'register',
    serializer: Serializer.model(TableInfo),
});
export const TableListenEvent = JsonEventType.ofExtension<string>(TableExtensionType, {
    name: 'listen',
});
export const TableProxyListenEvent = JsonEventType.ofExtension<string>(TableExtensionType, {
    name: 'proxy_listen',
});
export const TableProxyEvent = SerializeEventType.ofExtension<TableProxyData>(TableExtensionType, {
    name: 'proxy',
    serializer: proxySerializer,
});
export const TableProxyEndpoint = SerializeEndpointType.ofExtension<TableProxyData, void>(TableExtensionType, {
    name: 'proxy',
    requestSerializer: proxySerializer,
    responseSerializer: Serializer.noop(),
});

export const TableItemAddEvent = SerializeEventType.ofExtension<TableItemsData>(TableExtensionType, {
    name: 'item_add',
    serializer: itemsSerializer,
});
export const TableItemUpdateEvent = SerializeEventType.ofExtension<TableItemsData>(TableExtensionType, {
    name: 'item_update',
    serializer: itemsSerializer,
});
export const TableItemRemoveEvent = SerializeEventType.ofExtension<TableItemsData>(TableExtensionType, {
    name: 'item_remove',
    serializer: itemsSerializer,
});
export const TableItemClearEvent = JsonEventType.ofExtension<TableEventData>(TableExtensionType, {
    name: 'item_clear',
});
export const TableItemGetEndpoint = SerializeEndpointType.ofExtension<TableEventData & { keys: string[] }, TableItemsData>(TableExtensionType, {
    name: 'item_get',
    requestSerializer: Serializer.json(),
    responseSerializer: itemsSerializer,
});
export const TableItemFetchEndpoint = SerializeEndpointType.ofExtension<TableEventData & { before?: number, after?: number, cursor?: string }, TableItemsData>(TableExtensionType, {
    name: 'item_fetch',
    requestSerializer: Serializer.json(),
    responseSerializer: itemsSerializer,
});
export const TableItemSizeEndpoint = JsonEndpointType.ofExtension<TableEventData, number>(TableExtensionType, {
    name: 'item_size',
});
export const TablesTableType = ModelTableType.ofExtension(TableExtensionType, {
    name: 'tables',
    model: TableInfo,
});

export class TableExtension implements Extension {
    private readonly tableMap: Map<string, Table<any>>;
    public readonly tables: Table<TableInfo>;

    constructor(private readonly client: Client) {
        this.tableMap = new Map();
        client.events.register(TableRegisterEvent, TableProxyEvent, TableProxyListenEvent, TableListenEvent, TableItemAddEvent, TableItemRemoveEvent, TableItemUpdateEvent, TableItemClearEvent);
        this.tables = this.get(TablesTableType);
    }

    register<T extends Keyable>(type: TableType<T>): Table<T> {
        if (this.has(type)) {
            throw new Error(`Table for key ${type.key} already registered`);
        }
        const table = new TableImpl<T>(this.client, type, true);
        this.tableMap.set(type.key, table);
        return table as Table<T>;
    }

    get<T extends Keyable>(type: TableType<T>): Table<T> {
        if (this.has(type)) {
            return this.tableMap.get(type.key) as Table<T>;
        }
        const table = new TableImpl<T>(this.client, type, false);
        this.tableMap.set(type.key, table);
        return table as Table<T>;
    }

    has<K extends Keyable>(type: TableType<K>): boolean {
        return this.tableMap.has(type.key);
    }
}

class TableImpl<T extends Keyable> implements Table<T> {
    public readonly info: TableInfo;
    public cache: Map<string, T>;
    private readonly listeners: TableListener<T>[];
    private readonly proxies: Array<(item: T) => T | null>;
    private readonly key: string;
    private listening: boolean;
    private cacheSize?: number;

    constructor(
        private readonly client: Client,
        private readonly type: TableType<T>,
        private readonly owner: boolean,
    ) {
        this.cache = new Map();
        this.listeners = [];
        this.proxies = [];
        this.info = type.info;
        this.key = type.key;
        this.listening = false;

        client.connection.addListener(this);
        client.events.addListener(TableProxyEvent, (event) => {
            if (event.type !== this.key) {
                return;
            }
            let items = this.parseItems(event.items);
            this.proxies.forEach((proxy) => {
                items = new Map([...items.entries()].map(([key, item]) => {
                    const proxyItem = proxy(item);
                    if (proxyItem) {
                        return [key, proxyItem];
                    }
                    return undefined;
                }).filter((item): item is [string, T] => {
                    return typeof item !== 'undefined';
                }));
            });
            client.endpoints.call(TableProxyEndpoint, {
                type: this.key,
                key: event.key,
                items: Object.fromEntries([...items.entries()].map(([key, item]) => {
                    return [key, this.type.serializer.serialize(item)];
                })),
            });
        });
        client.events.addListener(TableItemAddEvent, (event) => {
            if (event.type !== this.key) {
                return;
            }
            const items = this.parseItems(event.items);
            this.updateCache(items);
            this.listeners.forEach((listener) => {
                listener.onAdd?.(items);
            });
        });
        client.events.addListener(TableItemUpdateEvent, (event) => {
            if (event.type !== this.key) {
                return;
            }
            const items = this.parseItems(event.items);
            this.updateCache(items);
            this.listeners.forEach((listener) => {
                listener.onUpdate?.(items);
            });
        });
        client.events.addListener(TableItemRemoveEvent, (event) => {
            if (event.type !== this.key) {
                return;
            }
            const items = this.parseItems(event.items);
            items.forEach((_, key) => {
                this.cache.delete(key);
            });
            this.listeners.forEach((listener) => {
                listener.onRemove?.(items);
                listener.onCacheUpdate?.(this.cache);
            });
        });
        client.events.addListener(TableItemClearEvent, (event) => {
            if (event.type !== this.key) {
                return;
            }
            this.cache = new Map();
            this.listeners.forEach((listener) => {
                listener.onClear?.();
                listener.onCacheUpdate?.(this.cache);
            });
        });
    }

    private updateCache(items: Map<string, T>): void {
        if (!this.cacheSize) {
            this.cache = new Map([...this.cache, ...items]);
        } else {
            const cache = new Map([...this.cache, ...items].slice(-this.cacheSize));
            this.cache = cache;
        }
        this.listeners.forEach((listener) => {
            listener.onCacheUpdate?.(this.cache);
        });
    }

    addListener(listener: TableListener<T>): void {
        if (this.listeners.includes(listener)) {
            throw new Error('Listener already registered');
        }
        this.listeners.push(listener);
    }

    removeListener(listener: TableListener<T>): void {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }

    private _listen(): void {
        this.client.connection.addTask(() => {
            this.client.send(TableListenEvent, this.key);
        });
    }

    listen(listener?: (items: Map<string, T>) => void): void {
        if (!this.listening) {
            this.client.connection.addTask(this._listen.bind(this));
            this.listening = true;
        }
        if (!listener) {
            return;
        }
        const tableListener = {
            onCacheUpdate: listener,
        };
        this.addListener(tableListener);
    }

    unlisten(listener?: ((items: Map<string, T>) => void) | undefined): void {
        if (listener) {
            this.removeListener({
                onCacheUpdate: listener,
            });
        }
        this.listening = this.listeners.length > 0;
    }

    proxy(callback: (item: T) => T | null): () => void {
        this.proxies.push(callback);
        return () => {
            this.proxies.splice(this.proxies.indexOf(callback), 1);
        };
    }

    onConnect(): void {
        if (this.owner) {
            this.client.send(TableRegisterEvent, this.info);
        }
        if (this.proxies.length > 0) {
            this.client.send(TableProxyListenEvent, this.key);
        }
    }

    async get(key: string): Promise<T | undefined> {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        const res = await this.client.endpoints.call(TableItemGetEndpoint, {
            type: this.key,
            keys: [key],
        });
        const items = this.parseItems(res.items);
        this.updateCache(items);
        return this.cache.get(key);
    }

    async getMany(keys: string[]): Promise<Map<string, T>> {
        const res = await this.client.endpoints.call(TableItemGetEndpoint, {
            type: this.key,
            keys,
        });
        const items = this.parseItems(res.items);
        this.updateCache(items);
        return items;
    }

    async add(...items: T[]): Promise<void> {
        const data = Object.fromEntries(items.map((item) => {
            return [item.key(), this.type.serializer.serialize(item)];
        }));
        this.client.send(TableItemAddEvent, {
            type: this.key,
            items: data,
        });
    }

    async set(...items: T[]): Promise<void> {
        const data = Object.fromEntries(items.map((item) => {
            return [item.key(), this.type.serializer.serialize(item)];
        }));
        this.client.send(TableItemUpdateEvent, {
            type: this.key,
            items: data,
        });
    }

    async remove(...items: T[]): Promise<void> {
        const data = Object.fromEntries(items.map((item) => {
            return [item.key(), this.type.serializer.serialize(item)];
        }));
        const keys = items.map((item) => item.key());
        this.cache = new Map([...this.cache].filter(([key]) => !keys.includes(key)));
        this.client.send(TableItemRemoveEvent, {
            type: this.key,
            items: data,
        });
    }

    async clear(): Promise<void> {
        this.client.send(TableItemClearEvent, {
            type: this.key,
        });
    }

    async fetch({ before, after, cursor }: { before: number, after: number, cursor?: string }): Promise<Map<string, T>> {
        const res = await this.client.endpoints.call(TableItemFetchEndpoint, {
            type: this.key,
            before,
            after,
            cursor,
        });
        const items = this.parseItems(res.items);
        this.updateCache(items);
        return items;
    }

    async *iter({ backward, cursor }: { backward?: boolean, cursor?: string }): AsyncIterable<T> {
        let items: Map<string, T> = await this.fetch(backward ? {
            before: 0,
            after: this.cacheSize ?? 100,
            cursor,
        } : {
            before: this.cacheSize ?? 100,
            after: 0,
            cursor,
        });
        yield* items.values();
        while (items.size > 0) {
            const cursor = backward ? items.values().next().value.key() : [...items.values()].pop()?.key();
            items = await this.fetch(backward ? { before: 0, after: this.cacheSize ?? 100, cursor } : { before: this.cacheSize ?? 100, after: 0, cursor });
            yield* items.values();
        }
    }

    async size(): Promise<number> {
        return await this.client.endpoints.call(TableItemSizeEndpoint, {
            type: this.key,
        });
    }

    private parseItems(items: Record<string, Uint8Array>): Map<string, T> {
        return new Map(Object.entries(items).map(([key, data]) => {
            const item = this.type.serializer.deserialize(data);
            this.cache.set(key, item);
            return [key, item];
        }));
    }

    setCacheSize(size: number): void {
        this.cacheSize = size;
    }
}
