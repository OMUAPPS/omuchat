import type { Client } from '../../client/index.js';
import type { Identifier } from '../../identifier.js';
import type { Keyable } from '../../interface.js';
import type { Model } from '../../model.js';
import { ByteReader, ByteWriter } from '../../network/bytebuffer.js';
import { PacketType } from '../../network/packet/packet.js';
import type { Serializable } from '../../serializer.js';
import { Serializer } from '../../serializer.js';
import { EndpointType } from '../endpoint/endpoint.js';
import type { Extension } from '../extension.js';
import { ExtensionType } from '../extension.js';

import { TableType, type Table, type TableConfig, type TableListener } from './table.js';

export const TABLE_EXTENSION_TYPE: ExtensionType<TableExtension> = new ExtensionType(
    'table',
    (client) => new TableExtension(client),
);

type TableEventData = { type: string };
type TableItemsData = TableEventData & { items: Record<string, Uint8Array> };
type TableProxyData = TableItemsData & { key: number };
type TableFetchData = TableEventData & { before?: number; after?: number; cursor?: string, };

const ITEMS_SERIALIZER = new Serializer<TableItemsData, Uint8Array>(
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
const ITEM_PROXY_SERIALIZER = new Serializer<TableProxyData, Uint8Array>(
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

const TABLE_CONFIG_PACKET = PacketType.createJson<{
    type: string;
    config: TableConfig;
}>(TABLE_EXTENSION_TYPE, {
    name: 'config',
});
const TABLE_LISTEN_PACKET = PacketType.createJson<string>(TABLE_EXTENSION_TYPE, {
    name: 'listen',
});
const TABLE_PROXY_LISTEN_PACKET = PacketType.createJson<string>(TABLE_EXTENSION_TYPE, {
    name: 'proxy_listen',
});
const TABLE_PROXY_PACKET = PacketType.createSerialized<TableProxyData>(TABLE_EXTENSION_TYPE, {
    name: 'proxy',
    serializer: ITEM_PROXY_SERIALIZER,
});
const TABLE_ITEM_ADD_PACKET = PacketType.createSerialized<TableItemsData>(TABLE_EXTENSION_TYPE, {
    name: 'item_add',
    serializer: ITEMS_SERIALIZER,
});
const TABLE_ITEM_UPDATE_PACKET = PacketType.createSerialized<TableItemsData>(TABLE_EXTENSION_TYPE, {
    name: 'item_update',
    serializer: ITEMS_SERIALIZER,
});
const TABLE_ITEM_REMOVE_PACKET = PacketType.createSerialized<TableItemsData>(TABLE_EXTENSION_TYPE, {
    name: 'item_remove',
    serializer: ITEMS_SERIALIZER,
});
const TABLE_ITEM_GET_ENDPOINT = EndpointType.createSerialized<
    TableEventData & { keys: string[] },
    TableItemsData
>(TABLE_EXTENSION_TYPE, {
    name: 'item_get',
    requestSerializer: Serializer.json(),
    responseSerializer: ITEMS_SERIALIZER,
});
const TABLE_FETCH_ENDPOINT = EndpointType.createSerialized<
    TableFetchData,
    TableItemsData
>(TABLE_EXTENSION_TYPE, {
    name: 'fetch',
    requestSerializer: Serializer.json(),
    responseSerializer: ITEMS_SERIALIZER,
});
const TABLE_FETCH_ALL_ENDPOINT = EndpointType.createSerialized<
    TableFetchData,
    TableItemsData
>(TABLE_EXTENSION_TYPE, {
    name: 'fetch_all',
    requestSerializer: Serializer.json(),
    responseSerializer: ITEMS_SERIALIZER,
});
const TABLE_SIZE_ENDPOINT = EndpointType.createJson<TableEventData, number>(TABLE_EXTENSION_TYPE, {
    name: 'size',
});
const TABLE_CLEAR_PACKET = PacketType.createJson<TableEventData>(TABLE_EXTENSION_TYPE, {
    name: 'clear',
});

export class TableExtension implements Extension {
    private readonly tableMap: Map<string, Table<unknown>>;

    constructor(private readonly client: Client) {
        this.tableMap = new Map();
        client.network.registerPacket(
            TABLE_CONFIG_PACKET,
            TABLE_PROXY_PACKET,
            TABLE_PROXY_LISTEN_PACKET,
            TABLE_LISTEN_PACKET,
            TABLE_ITEM_ADD_PACKET,
            TABLE_ITEM_REMOVE_PACKET,
            TABLE_ITEM_UPDATE_PACKET,
            TABLE_CLEAR_PACKET,
        );
    }

    create<T>(
        identifier: Identifier,
        serializer: Serializable<T, Uint8Array>,
        keyFunc: (item: T) => string,
    ): Table<T> {
        if (this.has(identifier)) {
            throw new Error('Table already exists');
        }
        const table = new TableImpl<T>(this.client, identifier, serializer, keyFunc);
        this.tableMap.set(identifier.key(), table);
        return table;
    }

    get<T extends Keyable>(type: TableType<T>): Table<T> {
        if (this.has(type.identifier)) {
            return this.tableMap.get(type.identifier.key()) as Table<T>;
        }
        return this.create(type.identifier, type.serializer, type.keyFunc);
    }

    model<T extends Keyable & Model<D>, D = unknown>(
        identifier: Identifier,
        {
            name,
            model,
        }: {
            name: string;
            model: { fromJson(data: D): T };
        },
    ): Table<T> {
        const tableType = TableType.model(identifier, { name, model });
        if (this.has(tableType.identifier)) {
            throw new Error('Table already exists');
        }
        return this.create(tableType.identifier, tableType.serializer, tableType.keyFunc);
    }

    has(identifier: Identifier): boolean {
        return this.tableMap.has(identifier.key());
    }
}

class TableImpl<T> implements Table<T> {
    public cache: Map<string, T>;
    private readonly listeners: TableListener<T>[];
    private readonly promiseMap: Map<string, Promise<T | undefined>>;
    private readonly proxies: Array<(item: T) => T | undefined>;
    private readonly key: string;
    private listening: boolean;
    private cacheSize?: number;
    private config?: TableConfig;

    constructor(
        private readonly client: Client,
        private readonly identifier: Identifier,
        private readonly serializer: Serializable<T, Uint8Array>,
        private readonly keyFunc: (item: T) => string,
    ) {
        this.cache = new Map();
        this.key = identifier.key();
        this.listeners = [];
        this.promiseMap = new Map();
        this.proxies = [];
        this.listening = false;

        client.network.addPacketHandler(TABLE_PROXY_PACKET, (event) => {
            if (event.type !== this.key) {
                return;
            }
            let items = this.deserializeItems(event.items);
            this.proxies.forEach((proxy) => {
                items = new Map(
                    [...items.entries()]
                        .map(([key, item]) => {
                            const proxyItem = proxy(item);
                            if (proxyItem !== undefined) {
                                return [key, proxyItem as T];
                            }
                            return undefined;
                        })
                        .filter((item): item is [string, T] => {
                            return typeof item !== 'undefined';
                        }),
                );
            });
            client.send(TABLE_PROXY_PACKET, {
                type: this.key,
                key: event.key,
                items: Object.fromEntries(
                    [...items.entries()].map(([key, item]) => {
                        return [key, this.serializer.serialize(item)];
                    }),
                ),
            });
        });
        client.network.addPacketHandler(TABLE_ITEM_ADD_PACKET, (event) => {
            if (event.type !== this.key) {
                return;
            }
            const items = this.deserializeItems(event.items);
            this.updateCache(items);
            this.listeners.forEach((listener) => {
                listener.onAdd?.(items);
            });
        });
        client.network.addPacketHandler(TABLE_ITEM_UPDATE_PACKET, (event) => {
            if (event.type !== this.key) {
                return;
            }
            const items = this.deserializeItems(event.items);
            this.updateCache(items);
            this.listeners.forEach((listener) => {
                listener.onUpdate?.(items);
            });
        });
        client.network.addPacketHandler(TABLE_ITEM_REMOVE_PACKET, (event) => {
            if (event.type !== this.key) {
                return;
            }
            const items = this.deserializeItems(event.items);
            items.forEach((_, key) => {
                this.cache.delete(key);
            });
            this.listeners.forEach((listener) => {
                listener.onRemove?.(items);
                listener.onCacheUpdate?.(this.cache);
            });
        });
        client.network.addPacketHandler(TABLE_CLEAR_PACKET, (event) => {
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
            this.cache = items;
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

    listen(listener?: (items: Map<string, T>) => void): () => void {
        if (!this.listening) {
            this.client.network.addTask(() => {
                this.client.send(TABLE_LISTEN_PACKET, this.key);
            });
            this.listening = true;
        }
        if (!listener) {
            return () => { };
        }
        const tableListener = {
            onCacheUpdate: listener,
        };
        this.addListener(tableListener);
        return () => this.unlisten(listener);
    }

    unlisten(listener?: ((items: Map<string, T>) => void) | undefined): void {
        if (listener) {
            this.removeListener({
                onCacheUpdate: listener,
            });
        }
        this.listening = this.listeners.length > 0;
    }

    proxy(callback: (item: T) => T | undefined): () => void {
        this.proxies.push(callback);
        return () => {
            this.proxies.splice(this.proxies.indexOf(callback), 1);
        };
    }

    onConnect(): void {
        if (this.config) {
            this.client.send(TABLE_CONFIG_PACKET, {
                type: this.key,
                config: this.config,
            });
        }
        if (this.proxies.length > 0) {
            this.client.send(TABLE_PROXY_LISTEN_PACKET, this.key);
        }
    }

    async get(key: string): Promise<T | undefined> {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        if (this.promiseMap.has(key)) {
            return await this.promiseMap.get(key);
        }
        const promise = this.client.endpoints.call(TABLE_ITEM_GET_ENDPOINT, {
            type: this.key,
            keys: [key],
        }).then((res) => {
            const items = this.deserializeItems(res.items);
            this.updateCache(items);
            return this.cache.get(key);
        });
        this.promiseMap.set(key, promise);
        return await promise.then((item) => {
            this.promiseMap.delete(key);
            return item;
        });
    }

    async getMany(...keys: string[]): Promise<Map<string, T>> {
        const filteredKeys = keys.filter((key) => !this.cache.has(key)).filter((key) => !this.promiseMap.has(key));
        if (filteredKeys.length === 0) {
            return new Map([...this.cache].filter(([key]) => keys.includes(key)));
        }
        const promise = this.client.endpoints.call(TABLE_ITEM_GET_ENDPOINT, {
            type: this.key,
            keys: filteredKeys,
        }).then((res) => {
            const items = this.deserializeItems(res.items);
            this.updateCache(items);
            return items;
        });
        for (const key of filteredKeys) {
            this.promiseMap.set(key, promise.then((items) => items.get(key)));
        }
        const items = await promise;
        for (const key of filteredKeys) {
            this.promiseMap.delete(key);
        }
        return new Map([...this.cache, ...items].filter(([key]) => keys.includes(key)));
    }

    async add(...items: T[]): Promise<void> {
        const data = this.serializeItems(items);
        this.client.send(TABLE_ITEM_ADD_PACKET, {
            type: this.key,
            items: data,
        });
    }

    async update(...items: T[]): Promise<void> {
        const data = this.serializeItems(items);
        this.client.send(TABLE_ITEM_UPDATE_PACKET, {
            type: this.key,
            items: data,
        });
    }

    async remove(...items: T[]): Promise<void> {
        const data = this.serializeItems(items);
        const keys = Object.keys(data);
        this.cache = new Map([...this.cache].filter(([key]) => !keys.includes(key)));
        this.client.send(TABLE_ITEM_REMOVE_PACKET, {
            type: this.key,
            items: data,
        });
    }

    async clear(): Promise<void> {
        this.client.send(TABLE_CLEAR_PACKET, {
            type: this.key,
        });
    }

    async fetchItems({
        before,
        after,
        cursor,
    }: {
        before: number;
        after: number;
        cursor?: string;
    }): Promise<Map<string, T>> {
        const res = await this.client.endpoints.call(TABLE_FETCH_ENDPOINT, {
            type: this.key,
            before,
            after,
            cursor,
        });
        const items = this.deserializeItems(res.items);
        this.updateCache(items);
        return items;
    }

    async fetchAll(): Promise<Map<string, T>> {
        const res = await this.client.endpoints.call(TABLE_FETCH_ALL_ENDPOINT, {
            type: this.key,
        });
        const items = this.deserializeItems(res.items);
        this.updateCache(items);
        return items;
    }

    async *iterate({ backward, cursor }: { backward?: boolean; cursor?: string }): AsyncIterable<T> {
        let items: Map<string, T> = await this.fetchItems(
            backward
                ? {
                    before: 0,
                    after: this.cacheSize ?? 100,
                    cursor,
                }
                : {
                    before: this.cacheSize ?? 100,
                    after: 0,
                    cursor,
                },
        );
        yield* items.values();
        while (items.size > 0) {
            const cursor = this.keyFunc(
                backward ? items.values().next().value : [...items.values()].pop(),
            );
            items = await this.fetchItems(
                backward
                    ? { before: 0, after: this.cacheSize ?? 100, cursor }
                    : { before: this.cacheSize ?? 100, after: 0, cursor },
            );
            yield* items.values();
        }
    }

    async size(): Promise<number> {
        return await this.client.endpoints.call(TABLE_SIZE_ENDPOINT, {
            type: this.key,
        });
    }

    private deserializeItems(items: Record<string, Uint8Array>): Map<string, T> {
        return new Map(
            Object.entries(items).map(([key, data]) => {
                const item = this.serializer.deserialize(data);
                this.cache.set(key, item);
                return [key, item];
            }),
        );
    }

    private serializeItems(items: T[]): Record<string, Uint8Array> {
        return Object.fromEntries(
            items.map((item) => {
                return [this.keyFunc(item), this.serializer.serialize(item)];
            }),
        );
    }

    setCacheSize(size: number): void {
        this.cacheSize = size;
    }

    setConfig(config: TableConfig): void {
        this.config = config;
    }
}
