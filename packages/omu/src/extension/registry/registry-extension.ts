import type { Client } from '../../client/index.js';
import { JsonEventType } from '../../event/index.js';
import { JsonEndpointType } from '../endpoint/endpoint.js';
import type { Extension } from '../extension.js';
import { defineExtensionType } from '../extension.js';
import { Registry } from './registry.js';

type Key = { name: string, app?: string };

export class RegistryExtension implements Extension {
    constructor(private readonly client: Client) {
        client.events.register(RegistryUpdateEvent);
    }

    async get<T>(key: Key): Promise<Registry<T>> {
        const identifier = `${key.app ?? this.client.app.key()}:${key.name}`;
        return new RegistryImpl(this.client, identifier);
    }
}

class RegistryImpl<T> implements Registry<T> {
    private readonly listeners: Array<(value: T | undefined) => void> = [];
    private listening: boolean = false;

    constructor(
        private readonly client: Client,
        private readonly key: string,
    ) { }

    async get(): Promise<T | undefined> {
        return await this.client.endpoints.call(RegistryGetEndpoint, this.key) as T;
    }

    async update(fn: (value: T | undefined) => T): Promise<void> {
        const value = await this.get();
        const newValue = await fn(value);
        this.client.send(RegistryUpdateEvent, {
            key: this.key,
            value: newValue,
        })
    }

    async listen(handler: (value: T | undefined) => void): Promise<() => void> {
        if (!this.listening) {
            this.client.connection.addTask(() => {
                this.client.send(RegistryListenEvent, this.key);
            });
            this.listening = true;
        }
        this.listeners.push(handler);
        return () => {
            this.listeners.splice(this.listeners.indexOf(handler), 1);
        };
    }
}

export const RegistryExtensionType = defineExtensionType('registry', {
    create: (client: Client) => new RegistryExtension(client),
});
export const RegistryUpdateEvent = JsonEventType.ofExtension<{ key: string, value: any }>(RegistryExtensionType, {
    name: 'update',
});
export const RegistryListenEvent = JsonEventType.ofExtension<string>(RegistryExtensionType, {
    name: 'listen',
});
export const RegistryGetEndpoint = JsonEndpointType.ofExtension<string, any>(RegistryExtensionType, {
    name: 'get',
});
