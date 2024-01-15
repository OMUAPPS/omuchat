import type { Client } from '../../client/index.js';
import type { ConnectionListener } from '../../connection/index.js';
import { JsonEventType } from '../../event/index.js';
import { JsonEndpointType } from '../endpoint/endpoint.js';
import type { Extension } from '../extension.js';
import { defineExtensionType } from '../extension.js';

type Key = { name: string, app?: string };

export class RegistryExtension implements Extension, ConnectionListener {
    private readonly listenKeys: Set<string> = new Set();

    constructor(private readonly client: Client) {
        client.events.register(RegistryUpdateEvent);
        client.connection.addListener(this);
    }

    async get<T>(key: Key): Promise<T> {
        return await this.client.endpoints.call(
            RegistryGetEndpoint,
            `${key.app ?? this.client.app.key()}:${key.name}`,
        ) as T;
    }

    set<T>(key: Key, value: T): void {
        this.client.send(RegistryUpdateEvent, {
            key: `${key.app ?? this.client.app.key()}:${key.name}`,
            value,
        });
    }

    listen<T>(key: Key, handler: (value: T | undefined) => void): () => void {
        const keyString = `${key.app ?? this.client.app.key()}:${key.name}`;
        this.listenKeys.add(keyString);
        const listener = (event: { key: string; value?: any; }): void => {
            if (event.key === keyString) {
                handler(event.value);
            }
        };
        this.client.events.addListener(RegistryUpdateEvent, listener);
        return () => {
            this.client.events.removeListener(RegistryUpdateEvent, listener);
        };
    }

    onConnect(): void {
        this.listenKeys.forEach((key) => {
            this.client.send(RegistryListenEvent, key);
        });
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
