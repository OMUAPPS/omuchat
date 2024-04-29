import type { Client } from '../../client/index.js';
import { Identifier, IdentifierMap } from '../../identifier.js';
import type { Keyable } from '../../interface.js';
import type { Model } from '../../model.js';
import { PacketType } from '../../network/packet/packet.js';
import type { Serializable } from '../../serializer.js';
import { Serializer } from '../../serializer.js';
import { EndpointType } from '../endpoint/endpoint.js';
import type { Extension } from '../extension.js';
import { ExtensionType } from '../extension.js';

import { SetConfigPacket, SetPermissionPacket, TableFetchPacket, TableItemsPacket, TableKeysPacket, TablePacket, TableProxyPacket } from './packets.js';
import type { Table, TableConfig, TablePermissions } from './table.js';
import { TableListeners, TableType } from './table.js';

export const TABLE_EXTENSION_TYPE: ExtensionType<TableExtension> = new ExtensionType(
    'table',
    (client) => new TableExtension(client),
);
const TABLE_SET_PERMISSION_PACKET = PacketType.createSerialized<SetPermissionPacket>(TABLE_EXTENSION_TYPE, {
    name: 'set_permission',
    serializer: SetPermissionPacket,
});
const TABLE_SET_CONFIG_PACKET = PacketType.createSerialized<SetConfigPacket>(TABLE_EXTENSION_TYPE, {
    name: 'set_config',
    serializer: SetConfigPacket,
});
const TABLE_LISTEN_PACKET = PacketType.createJson<Identifier>(TABLE_EXTENSION_TYPE, {
    name: 'listen',
    serializer: Serializer.model(Identifier),
});
const TABLE_PROXY_LISTEN_PACKET = PacketType.createJson<Identifier>(TABLE_EXTENSION_TYPE, {
    name: 'proxy_listen',
    serializer: Serializer.model(Identifier),
});
const TABLE_PROXY_PACKET = PacketType.createSerialized<TableProxyPacket>(TABLE_EXTENSION_TYPE, {
    name: 'proxy',
    serializer: TableProxyPacket,
});
const TABLE_ITEM_ADD_PACKET = PacketType.createSerialized<TableItemsPacket>(TABLE_EXTENSION_TYPE, {
    name: 'item_add',
    serializer: TableItemsPacket,
});
const TABLE_ITEM_UPDATE_PACKET = PacketType.createSerialized<TableItemsPacket>(TABLE_EXTENSION_TYPE, {
    name: 'item_update',
    serializer: TableItemsPacket,
});
const TABLE_ITEM_REMOVE_PACKET = PacketType.createSerialized<TableItemsPacket>(TABLE_EXTENSION_TYPE, {
    name: 'item_remove',
    serializer: TableItemsPacket,
});
const TABLE_ITEM_GET_ENDPOINT = EndpointType.createSerialized<
    TableKeysPacket,
    TableItemsPacket
>(TABLE_EXTENSION_TYPE, {
    name: 'item_get',
    requestSerializer: TableKeysPacket,
    responseSerializer: TableItemsPacket,
});
const TABLE_FETCH_ENDPOINT = EndpointType.createSerialized<
    TableFetchPacket,
    TableItemsPacket
>(TABLE_EXTENSION_TYPE, {
    name: 'fetch',
    requestSerializer: TableFetchPacket,
    responseSerializer: TableItemsPacket,
});
const TABLE_FETCH_ALL_ENDPOINT = EndpointType.createSerialized<
    TablePacket,
    TableItemsPacket
>(TABLE_EXTENSION_TYPE, {
    name: 'fetch_all',
    requestSerializer: TablePacket,
    responseSerializer: TableItemsPacket,
});
const TABLE_SIZE_ENDPOINT = EndpointType.createSerialized<TablePacket, number>(TABLE_EXTENSION_TYPE, {
    name: 'size',
    requestSerializer: TablePacket,
    responseSerializer: Serializer.json(),
});
const TABLE_ITEM_CLEAR_PACKET = PacketType.createSerialized<TablePacket>(TABLE_EXTENSION_TYPE, {
    name: 'clear',
    serializer: TablePacket,
});

export class TableExtension implements Extension {
    private readonly tableMap = new IdentifierMap<Table<unknown>>();

    constructor(private readonly client: Client) {
        client.network.registerPacket(
            TABLE_SET_PERMISSION_PACKET,
            TABLE_SET_CONFIG_PACKET,
            TABLE_LISTEN_PACKET,
            TABLE_PROXY_LISTEN_PACKET,
            TABLE_PROXY_PACKET,
            TABLE_ITEM_ADD_PACKET,
            TABLE_ITEM_UPDATE_PACKET,
            TABLE_ITEM_REMOVE_PACKET,
            TABLE_ITEM_CLEAR_PACKET,
        );
    }

    public create<T>(
        tableType: TableType<T>,
    ): Table<T> {
        if (this.has(tableType.identifier)) {
            throw new Error('Table already exists');
        }
        const table = new TableImpl<T>(this.client, tableType);
        this.tableMap.set(tableType.identifier, table as Table<unknown>);
        return table;
    }

    public get<T extends Keyable>(type: TableType<T>): Table<T> {
        if (this.has(type.identifier)) {
            return this.tableMap.get(type.identifier) as Table<T>;
        }
        return this.create(type);
    }

    public model<T extends Keyable & Model<D>, D = unknown>(
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
        return this.create(tableType);
    }

    public has(identifier: Identifier): boolean {
        return this.tableMap.has(identifier);
    }
}

class TableImpl<T> implements Table<T> {
    public cache: Map<string, T>;
    public readonly listeners: TableListeners<T>;
    private readonly promiseMap: Map<string, Promise<T | undefined>>;
    private readonly proxies: Array<(item: T) => T | undefined>;
    private id: Identifier;
    private serializer: Serializable<T, Uint8Array>;
    private keyFunction: (item: T) => string;
    private listening: boolean;
    private cacheSize?: number;
    private config?: TableConfig;
    private permissions?: TablePermissions;

    constructor(
        private readonly client: Client,
        tableType: TableType<T>,
    ) {
        this.id = tableType.identifier;
        this.serializer = tableType.serializer;
        this.keyFunction = tableType.keyFunction;
        this.cache = new Map();
        this.listeners = new TableListeners();
        this.promiseMap = new Map();
        this.proxies = [];
        this.listening = false;

        client.network.addPacketHandler(TABLE_PROXY_PACKET, (packet) => {
            if (!packet.id.isEqual(this.id)) {
                return;
            }
            let items = this.deserializeItems(packet.items);
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
                id: this.id,
                key: packet.key,
                items: Object.fromEntries(
                    [...items.entries()].map(([key, item]) => {
                        return [key, this.serializer.serialize(item)];
                    }),
                ),
            });
        });
        client.network.addPacketHandler(TABLE_ITEM_ADD_PACKET, (packet) => {
            if (!packet.id.isEqual(this.id)) {
                return;
            }
            const items = this.deserializeItems(packet.items);
            this.updateCache(items);
            this.listeners.add.emit(items);
        });
        client.network.addPacketHandler(TABLE_ITEM_UPDATE_PACKET, (packet) => {
            if (!packet.id.isEqual(this.id)) {
                return;
            }
            const items = this.deserializeItems(packet.items);
            this.updateCache(items);
            this.listeners.update.emit(items);
        });
        client.network.addPacketHandler(TABLE_ITEM_REMOVE_PACKET, (packet) => {
            if (!packet.id.isEqual(this.id)) {
                return;
            }
            const items = this.deserializeItems(packet.items);
            items.forEach((_, key) => {
                this.cache.delete(key);
            });
            this.listeners.remove.emit(items);
            this.listeners.cacheUpdate.emit(this.cache);
        });
        client.network.addPacketHandler(TABLE_ITEM_CLEAR_PACKET, (packet) => {
            if (!packet.id.isEqual(this.id)) {
                return;
            }
            this.cache = new Map();
            this.listeners.clear.emit();
            this.listeners.cacheUpdate.emit(this.cache);
        });
        client.listeners.ready.subscribe(() => this.onReady());
    }
    private updateCache(items: Map<string, T>): void {
        if (!this.cacheSize) {
            this.cache = items;
        } else {
            const cache = new Map([...this.cache, ...items].slice(-this.cacheSize));
            this.cache = cache;
        }
        this.listeners.cacheUpdate.emit(this.cache);
    }

    public listen(listener?: (items: Map<string, T>) => void): () => void {
        this.listening = true;
        if (listener) {
            this.listeners.cacheUpdate.subscribe(listener);
            return () => {
                this.listeners.cacheUpdate.unsubscribe(listener);
            };
        }
        return () => { };
    }

    public proxy(callback: (item: T) => T | undefined): () => void {
        this.proxies.push(callback);
        return () => {
            this.proxies.splice(this.proxies.indexOf(callback), 1);
        };
    }

    private onReady(): void {
        if (this.config) {
            this.client.send(TABLE_SET_CONFIG_PACKET, {
                id: this.id,
                config: this.config,
            });
        }
        if (this.proxies.length > 0) {
            this.client.send(TABLE_PROXY_LISTEN_PACKET, this.id);
        }
        if (this.listening) {
            this.client.send(TABLE_LISTEN_PACKET, this.id);
        }
    }

    public async get(key: string): Promise<T | undefined> {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        if (this.promiseMap.has(key)) {
            return await this.promiseMap.get(key);
        }
        const promise = this.client.endpoints.call(TABLE_ITEM_GET_ENDPOINT, {
            id: this.id,
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

    public async getMany(...keys: string[]): Promise<Map<string, T>> {
        const filteredKeys = keys.filter((key) => !this.cache.has(key)).filter((key) => !this.promiseMap.has(key));
        if (filteredKeys.length === 0) {
            return new Map([...this.cache].filter(([key]) => keys.includes(key)));
        }
        const promise = this.client.endpoints.call(TABLE_ITEM_GET_ENDPOINT, {
            id: this.id,
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

    public async add(...items: T[]): Promise<void> {
        const data = this.serializeItems(items);
        this.client.send(TABLE_ITEM_ADD_PACKET, {
            id: this.id,
            items: data,
        });
    }

    public async update(...items: T[]): Promise<void> {
        const data = this.serializeItems(items);
        this.client.send(TABLE_ITEM_UPDATE_PACKET, {
            id: this.id,
            items: data,
        });
    }

    public async remove(...items: T[]): Promise<void> {
        const data = this.serializeItems(items);
        const keys = Object.keys(data);
        this.cache = new Map([...this.cache].filter(([key]) => !keys.includes(key)));
        this.client.send(TABLE_ITEM_REMOVE_PACKET, {
            id: this.id,
            items: data,
        });
    }

    public async clear(): Promise<void> {
        this.client.send(TABLE_ITEM_CLEAR_PACKET, {
            id: this.id,
        });
    }

    public async fetchItems({
        before,
        after,
        cursor,
    }: {
        before: number;
        after: number;
        cursor?: string;
    }): Promise<Map<string, T>> {
        const res = await this.client.endpoints.call(TABLE_FETCH_ENDPOINT, new TableFetchPacket(
            this.id,
            before,
            after,
            cursor ?? null,
        ));
        const items = this.deserializeItems(res.items);
        this.updateCache(items);
        return items;
    }

    public async fetchAll(): Promise<Map<string, T>> {
        const res = await this.client.endpoints.call(TABLE_FETCH_ALL_ENDPOINT, {
            id: this.id,
        });
        const items = this.deserializeItems(res.items);
        this.updateCache(items);
        return items;
    }

    public async *iterate({ backward, cursor }: { backward?: boolean; cursor?: string }): AsyncIterable<T> {
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
            const cursor = this.keyFunction(
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

    public async size(): Promise<number> {
        return await this.client.endpoints.call(TABLE_SIZE_ENDPOINT, {
            id: this.id,
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
                return [this.keyFunction(item), this.serializer.serialize(item)];
            }),
        );
    }

    public setCacheSize(size: number): void {
        this.cacheSize = size;
    }

    public setConfig(config: TableConfig): void {
        this.config = config;
    }

    public setPermissions(permissions: TablePermissions): void {
        this.permissions = permissions;
    }
}
