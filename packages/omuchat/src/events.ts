import { PluginInfo, ListInfo, ProxyInfo } from "./model";

export interface EventJson<T extends keyof EventMap> {
    type: T;
    data: EventMap[T];
}

export interface Event {}

export interface ListEvent extends Event {
    id: string;
}

export interface ListItemAdd<T> extends ListEvent {
    items: Record<string, T>;
}

export interface ListItemSet<T> extends ListEvent {
    items: Record<string, T>;
}

export interface ListItemRemove<T> extends ListEvent {
    items: Record<string, T>;
}

export interface ListItemPurge extends ListEvent {
    keys: string[];
}

export interface ListProxyEvent extends Event {
    id: string;
    proxy_id: string;
}

export interface ListProxyItemAdd<T> extends ListProxyEvent {
    items: Record<string, T>;
}

export interface ListProxyItemSet<T> extends ListProxyEvent {
    items: Record<string, T>;
}

export interface ListProxyItemRemove<T> extends ListProxyEvent {
    items: Record<string, T>;
}

export interface ListProxyItemPurge extends ListProxyEvent {
    keys: string[];
}

export type ProxyEventType = "any" | "add" | "set" | "delete" | "purge";

export interface ListProxyRequest extends Event, ProxyInfo {
    type: ProxyEventType;
}

export interface ListCreate extends Event {
    info: ListInfo;
    items: Record<string, any>;
}

export interface ListDelete extends Event {
    id: string;
}

export interface Connect extends Event {
    plugin_info: PluginInfo;
}

export interface Ready extends Event {
    version: string;
}

export interface Action extends Event {
    action: string;
    args: Record<string, any>;
}

// EVENTSの型定義
export type EventType = keyof EventMap;

export type EventMap = {
    Connect: Connect;
    Ready: Ready;
    ListCreate: ListCreate;
    ListDelete: ListDelete;
    ListItemAdd: ListItemAdd<any>;
    ListItemSet: ListItemSet<any>;
    ListItemDelete: ListItemRemove<any>;
    ListItemPurge: ListItemPurge;
    ListProxyItemAdd: ListProxyItemAdd<any>;
    ListProxyItemSet: ListProxyItemSet<any>;
    ListProxyItemDelete: ListProxyItemRemove<any>;
    ListProxyItemPurge: ListProxyItemPurge;
    ListProxyRequest: ListProxyRequest;
    Action: Action;
};
