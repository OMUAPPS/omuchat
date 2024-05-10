import type { Unlisten } from '@omuchatjs/omu/event-emitter.js';

import type { Client } from '../client.js';

import type { EventKey } from './event.js';

export type EventHandler<T extends unknown[]> = (...event: T) => void;

export class EventRegistry {
    private readonly handlers: Map<string, EventHandler<any>[]> = new Map();

    constructor(private readonly client: Client) { }

    public on<T extends unknown[]>(event: EventKey<T>, handler: EventHandler<T>): Unlisten {
        if (!this.handlers.has(event.name)) {
            event.create(this.client, (...data) => {
                this.emit(event, ...data);
            });
        }
        const handlers = this.handlers.get(event.name) || new Array<EventHandler<T>>();
        handlers.push(handler);
        this.handlers.set(event.name, handlers);
        return () => {
            const handlers = this.handlers.get(event.name);
            if (handlers) {
                const index = handlers.indexOf(handler);
                if (index !== -1) {
                    handlers.splice(index, 1);
                }
            }
        };
    }

    public emit<T extends unknown[]>(event: EventKey<T>, ...data: T): void {
        const handlers = this.handlers.get(event.name);
        if (handlers) {
            for (const handler of handlers) {
                handler(...data);
            }
        }
    }
}
