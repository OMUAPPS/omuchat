import axios from "axios";

import type { EventJson, EventMap, ProxyEventType } from "./events";
import {
    ActionInfo,
    ChannelInfo,
    Keyable,
    ListInfo,
    Message,
    PluginInfo,
    ProviderInfo,
    RoomInfo,
} from "./model";

interface EventListener {
    on<K extends keyof EventMap>(
        event: K,
        listener: (event: EventMap[K]) => void,
    ): void;
}

interface ListApi extends EventListener {
    readonly pluginId: string;
    fetchInfo(id: string): Promise<ListInfo>;
    get(id: string, key: string): Promise<any>;
    set(id: string, key: string, value: any): Promise<void>;
    add(id: string, key: string, value: any): Promise<void>;
    delete(id: string, key: string): Promise<void>;
    purge(id: string, keys: Array<string>): Promise<void>;
    len(id: string): Promise<number>;
    fetch(
        id: string,
        cursor: string | null,
        limit: number,
    ): Promise<Record<string, any>>;
    sendEvent<T extends keyof EventMap>(event: EventJson<T>): Promise<void>;
    requestProxy(
        id: string,
        type: ProxyEventType,
        priority: number,
    ): Promise<void>;
}

const proxy = <T = any>(item: T, proxies: Array<(item: T) => T | null>) => {
    let result: T | null = item;
    for (const proxy of proxies) {
        result = proxy(result);
        if (!result) return;
    }
    return result;
};

interface Handlers<T> {
    any: Array<(item: T) => void>;
    add: Array<(item: T) => void>;
    set: Array<(item: T) => void>;
    delete: Array<(item: T) => void>;
    purge: Array<(keys: Array<string>) => void>;
}

interface Proxies<T> {
    any: Array<(item: T) => T | null>;
    add: Array<(item: T) => T | null>;
    set: Array<(item: T) => T | null>;
    delete: Array<(item: T) => T | null>;
    purge: Array<(keys: Array<string>) => Array<string> | null>;
}

export interface ListOptions<T> {
    api: ListApi;
    id: string;
    factory?: (data: any) => T;
    cache?: Record<string, T>;
    limit?: number;
}

export class List<T extends Keyable> {
    private listeners: Array<(items: Record<string, T>) => void> = [];
    private handlers: Handlers<T> = {
        any: [],
        add: [],
        set: [],
        delete: [],
        purge: [],
    };
    private proxies: Proxies<T> = {
        any: [],
        add: [],
        set: [],
        delete: [],
        purge: [],
    };
    private readonly api: ListApi;
    private readonly id: string;
    public cache: Record<string, T>;
    public limit: number | null = null;
    private factory?: (data: any) => T;

    constructor(options: ListOptions<T>) {
        const { api, id, cache, limit, factory } = options;
        this.api = api;
        this.id = id;
        this.cache = cache || {};
        this.limit = limit || (limit === 0 ? 0 : null);
        this.factory = factory;

        api.on("ListItemAdd", (event) => {
            if (event.id != id) return;
            event.items = this.parseItems(event.items);
            this.cache = { ...this.cache, ...event.items };
            this.handlers.add.forEach((handler) => {
                Object.values(event.items).forEach((item) => handler(item));
            });
            this.listeners.forEach((handler) => {
                handler(this.cache);
            });
        });
        api.on("ListItemSet", (event) => {
            if (event.id != id) return;
            event.items = this.parseItems(event.items);
            this.cache = { ...this.cache, ...event.items };
            this.handlers.set.forEach((handler) => {
                Object.values(event.items).forEach((item) => handler(item));
            });
            this.listeners.forEach((handler) => {
                handler(this.cache);
            });
        });
        api.on("ListItemDelete", (event) => {
            if (event.id != id) return;
            event.items = this.parseItems(event.items);
            for (const key of Object.keys(event.items)) {
                delete this.cache[key];
            }
            this.handlers.delete.forEach((handler) => {
                Object.values(event.items).forEach((item) => handler(item));
            });
            this.listeners.forEach((handler) => {
                handler(this.cache);
            });
        });
        api.on("ListItemPurge", (event) => {
            if (event.id != id) return;
            for (const key of event.keys) {
                delete this.cache[key];
            }
            this.handlers.purge.forEach((handler) => {
                handler(event.keys);
            });
            this.listeners.forEach((handler) => {
                handler(this.cache);
            });
        });

        api.on("ListProxyItemAdd", (event) => {
            if (event.id != id) return;
            const items: Record<string, T> = {};
            for (const key of Object.keys(event.items)) {
                const value = proxy(event.items[key], this.proxies.add);
                if (value) items[key] = value;
            }
            event.items = items;
            api.sendEvent({
                type: "ListProxyItemAdd",
                data: { ...event, proxy_id: api.pluginId },
            });
        });
        api.on("ListProxyItemSet", (event) => {
            if (event.id != id) return;
            const items: Record<string, T> = {};
            for (const key of Object.keys(event.items)) {
                const value = proxy(event.items[key], this.proxies.set);
                if (value) items[key] = value;
            }
            event.items = items;
            api.sendEvent({
                type: "ListProxyItemSet",
                data: { ...event, proxy_id: api.pluginId },
            });
        });
        api.on("ListProxyItemDelete", (event) => {
            if (event.id != id) return;
            const items: Record<string, T> = {};
            for (const key of Object.keys(event.items)) {
                const value = proxy(event.items[key], this.proxies.delete);
                if (value) items[key] = value;
            }
            event.items = items;
            api.sendEvent({
                type: "ListProxyItemDelete",
                data: { ...event, proxy_id: api.pluginId },
            });
        });
        api.on("ListProxyItemPurge", (event) => {
            if (event.id != id) return;
            event.keys = proxy(event.keys, this.proxies.purge) || [];
            api.sendEvent({
                type: "ListProxyItemPurge",
                data: { ...event, proxy_id: api.pluginId },
            });
        });

        this.listen((items) => {
            if (this.limit && Object.keys(items).length > this.limit) {
                this.cache = Object.fromEntries(
                    Object.entries(items).slice(
                        Object.keys(items).length - this.limit,
                    ),
                );
            }
        });
    }

    private parseItems(items: Record<string, any>) {
        if (!this.factory) return items;
        return Object.fromEntries(
            Object.entries(items).map(([key, value]) => [
                key,
                this.factory!(value),
            ]),
        );
    }

    async get(key: string) {
        const item = await this.api.get(this.id, key);
        this.cache[key] = item;
        return item;
    }

    async set(item: T) {
        return await this.api.set(this.id, item.key(), item);
    }

    async add(item: T) {
        return await this.api.add(this.id, item.key(), item);
    }

    async delete(item: T | string) {
        return await this.api.delete(
            this.id,
            typeof item === "string" ? item : item.key(),
        );
    }

    async purge(keys: string[]) {
        return await this.api.purge(this.id, keys);
    }

    async len() {
        return await this.api.len(this.id);
    }

    async fetch(
        cursor: string | null = null,
        limit: number = 100,
    ): Promise<Record<string, T>> {
        const data = await this.api.fetch(this.id, cursor, limit);
        const items = this.parseItems(data);
        this.cache = { ...this.cache, ...items };
        return items;
    }

    async *iterate() {
        let cursor: string | null = null;
        while (true) {
            const data = await this.fetch(cursor);
            if (!Object.keys(data).length) return;

            for (const item of Object.values(data)) {
                yield item;
            }
            cursor = Object.keys(data).pop()!;
        }
    }

    listen(listener: (items: Record<string, T>) => void) {
        this.listeners.push(listener);
    }

    on<K extends keyof Handlers<T>>(
        event: K,
        listener: Handlers<T>[K][number],
    ) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(listener as any);
    }

    proxy<K extends keyof Proxies<T>>(
        event: K,
        proxy: Proxies<T>[K][number],
    ): void {
        if (!this.proxies[event]) {
            this.proxies[event] = [];
        }
        this.proxies[event].push(proxy as any);
    }

    setLimit(limit: number) {
        this.limit = limit;
        return this;
    }
}

export class ListApiImpl implements ListApi {
    readonly pluginId: string;
    constructor(private omuChat: OmuChat) {
        this.pluginId = omuChat.pluginInfo.key();
    }

    fetchInfo(id: string): Promise<ListInfo> {
        return this.omuChat.schedule(async () => {
            const res = await axios.get(
                `http://${this.omuChat.host}/api/v1/lists/${id}`,
            );
            return res.data;
        });
    }

    get(id: string, key: string): Promise<any> {
        return this.omuChat.schedule(async () => {
            const res = await axios.get(
                `http://${this.omuChat.host}/api/v1/lists/${id}/${key}`,
            );
            return res.data;
        });
    }

    set(id: string, key: string, value: any): Promise<void> {
        return this.omuChat.schedule(async () => {
            this.omuChat.send("ListItemSet", { id, items: { [key]: value } });
        });
    }

    add(id: string, key: string, value: any): Promise<void> {
        return this.omuChat.schedule(async () => {
            this.omuChat.send("ListItemAdd", { id, items: { [key]: value } });
        });
    }

    delete(id: string, key: string): Promise<void> {
        return this.omuChat.schedule(async () => {
            this.omuChat.send("ListItemDelete", { id, items: { [key]: null } });
        });
    }

    purge(id: string, keys: Array<string>): Promise<void> {
        return this.omuChat.schedule(async () => {
            this.omuChat.send("ListItemPurge", { id, keys });
        });
    }

    len(id: string): Promise<number> {
        return this.omuChat.schedule(async () => {
            const res = await axios.get(
                `http://${this.omuChat.host}/api/v1/list/${id}/len`,
            );
            return res.data;
        });
    }

    fetch(
        id: string,
        cursor: string | null,
        limit: number,
    ): Promise<Record<string, any>> {
        return this.omuChat.schedule(async () => {
            const res = await axios.post(
                `http://${this.omuChat.host}/api/v1/list/${id}/fetch`,
                {
                    params: {
                        cursor,
                        limit,
                    },
                },
            );
            return res.data;
        });
    }

    sendEvent<T extends keyof EventMap>(event: EventJson<T>) {
        return this.omuChat.schedule(async () => {
            this.omuChat.send(event.type, event.data as any);
        });
    }

    requestProxy(
        id: string,
        type: ProxyEventType,
        priority: number,
    ): Promise<void> {
        return this.omuChat.schedule(async () => {
            await axios.post(`http://${this.omuChat.host}/api/v1/lists/proxy`, {
                id,
                type,
                priority,
            });
        });
    }

    on<K extends keyof EventMap>(
        event: K,
        listener: (event: EventMap[K]) => void,
    ) {
        this.omuChat.on(event, listener);
    }
}

export const Status = {
    CONNECTED: "connected",
    CONNECTING: "connecting",
    RECONNECTING: "reconnecting",
    DISCONNECTED: "disconnected",
};

export type StatusValue = (typeof Status)[keyof typeof Status];

export type ClientEvents = {
    status: {
        status: StatusValue;
    };
};

export type Events = EventMap & ClientEvents;

export interface Client {
    on<K extends keyof Events>(
        event: K,
        listener: (event: Events[K]) => void,
    ): () => void;
    send<K extends keyof Events>(event: K, data: Events[K]): void;
}

export class OmuChat implements Client, EventListener {
    private taskTimer: NodeJS.Timeout | null = null;
    constructor(readonly pluginInfo: PluginInfo) {
        const api = new ListApiImpl(this);
        this.connections = new List({ api, id: "connections" });
        this.plugins = new List({ api, id: "plugins" });
        this.rooms = new List({ api, id: "rooms" });
        this.providers = new List({ api, id: "providers" });
        this.channels = new List({ api, id: "channels" });
        this.messages = new List({ api, id: "messages" });
        this.actions = new List({
            api,
            id: "actions",
            factory: (data) => {
                return new ActionInfo(
                    this,
                    data.id,
                    data.name,
                    data.description,
                    data.icon,
                );
            },
        });
        this.lists = new List({ api, id: "lists" });

        this.on("Ready", () => {
            console.log("ready");
        });
    }

    private eventHandlers: Record<
        keyof Events | string,
        Array<(event: any) => void>
    > = {};
    private socket: WebSocket | null = null;
    private tasks: Array<() => Promise<void>> = [];
    public connections: List<PluginInfo>;
    public plugins: List<PluginInfo>;
    public rooms: List<RoomInfo>;
    public providers: List<ProviderInfo>;
    public channels: List<ChannelInfo>;
    public messages: List<Message>;
    public actions: List<ActionInfo>;
    public lists: List<ListInfo>;
    public host: string = "";
    public connected: boolean = false;
    public connecting: boolean = false;
    public connectAttemptCount: number = 0;

    status(): StatusValue {
        if (this.connected) return Status.CONNECTED;
        if (this.connecting)
            return this.connectAttemptCount > 0
                ? Status.RECONNECTING
                : Status.CONNECTING;
        return Status.DISCONNECTED;
    }

    async run(host: string, port: number = 26423) {
        this.host = `${host}:${port}`;
        this.tryConnect();
    }

    tryConnect() {
        if (this.connected || this.connecting) return;
        this.connecting = true;
        this.emit("status", { status: this.status() });
        this.socket = new WebSocket(`ws://${this.host}/api/v1/ws`);
        this.socket.onopen = () => {
            console.log("connected");
            this.connected = true;
            this.connecting = false;
            this.connectAttemptCount = 0;
            this.emit("status", { status: this.status() });
            this.send("Connect", {
                plugin_info: this.pluginInfo,
            });
            this.taskTimer = setInterval(async () => {
                if (!this.tasks.length) return;
                const task = this.tasks.shift()!;
                await task();
            });
        };

        this.socket.onmessage = (event) => {
            const data: EventJson<any> = JSON.parse(event.data as string);
            this.emit(data.type, data.data);
        };

        this.socket.onclose = () => {
            console.log("disconnected");
            this.close();
            setTimeout(
                () => {
                    this.connectAttemptCount++;
                    this.tryConnect();
                },
                this.connectAttemptCount > 10 ? 3000 : 0,
            );
        };

        this.socket.onerror = (event) => {
            console.log("error", event);
        };
    }

    disconnect() {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            throw new Error("not connected");
        }
        this.close();
    }

    reconnect() {
        this.close();
        this.tryConnect();
    }

    close() {
        if (this.socket) {
            try {
                this.socket!.onclose = null;
                this.socket!.onerror = null;
                this.socket.close();
            } catch (e) {
                console.error(e);
            }
        }
        this.socket = null;
        this.connected = false;
        this.connecting = false;
        this.emit("status", { status: Status.DISCONNECTED });
        clearTimeout(this.taskTimer!);
    }

    schedule<T>(task: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.tasks.push(async () => {
                try {
                    const result = await task();
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    send<K extends keyof Events>(event: K, data: Events[K]) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            this.tasks.push(async () => {
                this.send(event, data);
            });
            return;
        }
        this.socket.send(JSON.stringify({ type: event, data }));
    }

    on<K extends keyof Events>(event: K, listener: (event: Events[K]) => void) {
        if (!this.eventHandlers[event]) {
            this.eventHandlers[event] = [];
        }
        this.eventHandlers[event].push(listener);
        return () => {
            this.eventHandlers[event] = this.eventHandlers[event].filter(
                (handler) => handler !== listener,
            );
        };
    }

    private emit<T extends keyof Events>(type: T, data: Events[T]) {
        if (!this.eventHandlers[type]) return;
        this.eventHandlers[type].forEach((handler) => {
            handler(data);
        });
    }

    proxy(url: string) {
        return `http://${this.host}/proxy?url=${encodeURIComponent(url)}`;
    }
}
