import type { Unlisten } from '@omujs/omu/event-emitter.js';
import { EventEmitter } from '@omujs/omu/event-emitter.js';
import type { Table } from '@omujs/omu/extension/table/table.js';

import type { Chat } from '../chat.js';

export type EventHandler<P extends Array<unknown>> = (...args: P) => Promise<void> | void;

export interface EventSource<P extends Array<unknown>> {
    subscribe(handler: EventHandler<P>, chat: Chat): Unlisten;
}

export class ListenerEvent<P extends Array<unknown>> implements EventSource<P> {
    constructor(private readonly getListener: (chat: Chat) => EventEmitter<P>) {}

    public subscribe(handler: EventHandler<P>, chat: Chat): Unlisten {
        const listener = this.getListener(chat);
        return listener.listen(handler);
    }
}

export class TableEvent<T> extends ListenerEvent<[Map<string, T>]> {
    public readonly addBatch: ListenerEvent<[Map<string, T>]>;
    public readonly updateBatch: ListenerEvent<[Map<string, T>]>;
    public readonly removeBatch: ListenerEvent<[Map<string, T>]>;
    public readonly add: EventSource<[T]>;
    public readonly update: EventSource<[T]>;
    public readonly remove: EventSource<[T]>;
    public readonly clear: EventSource<[]>;
    public readonly wrappers: Record<string, Unlisten>;

    constructor(private readonly getTable: (chat: Chat) => Table<T>) {
        super((chat) => getTable(chat).event.cacheUpdate);
        this.addBatch = new ListenerEvent((chat) => getTable(chat).event.add);
        this.updateBatch = new ListenerEvent((chat) => getTable(chat).event.update);
        this.removeBatch = new ListenerEvent((chat) => getTable(chat).event.remove);
        this.add = this.createBatchSubscriber((table) => table.event.add);
        this.update = this.createBatchSubscriber((table) => table.event.update);
        this.remove = this.createBatchSubscriber((table) => table.event.remove);
        this.clear = new ListenerEvent((client) => getTable(client).event.clear);
        this.wrappers = {};
    }

    private static createBatchWrapper<T>(emit: EventHandler<[T]>): EventHandler<[Map<string, T>]> {
        return async (items) => {
            for (const item of items.values()) {
                await emit(item);
            }
        };
    }

    private createBatchSubscriber(
        getListener: (table: Table<T>) => EventEmitter<[Map<string, T>]>,
    ): EventSource<[T]> {
        let batchWrapper: EventHandler<[Map<string, T>]> | null = null;

        const subscribe = (emit: EventHandler<[T]>, chat: Chat): Unlisten => {
            const listener = getListener(this.getTable(chat));
            batchWrapper = TableEvent.createBatchWrapper((item) => emit(item));
            return listener.listen(batchWrapper);
        };

        return {
            subscribe,
        };
    }
}

type Entry<P extends Array<unknown>> = {
    source: EventSource<P>;
    listeners: EventEmitter<P>;
};

export class EventRegistry {
    private readonly chat: Chat;
    private readonly events: Map<EventSource<unknown[]>, Entry<unknown[]>>;

    constructor(chat: Chat) {
        this.chat = chat;
        this.events = new Map();
    }

    public register<P extends Array<unknown>>(event: EventSource<P>, handler: EventHandler<P>): void {
        let entry = this.events.get(event) as Entry<P> | null;
        if (!entry) {
            const newEntry: Entry<P> = {
                source: event,
                listeners: new EventEmitter(),
            };
            entry = newEntry;
            this.events.set(event, newEntry);
            event.subscribe((...args) => newEntry.listeners.emit(...args), this.chat);
        }
        entry.listeners.listen((...args) => handler(...args));
    }
}
