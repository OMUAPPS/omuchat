import type { Client } from '../../client/index.js';
import type { ConnectionListener } from '../../connection/index.js';
import { JsonEventType } from '../../event/index.js';
import type { Extension } from '../extension.js';
import { defineExtensionType } from '../extension.js';

type Key = { name: string, app?: string };

export class MessageExtension implements Extension, ConnectionListener {
    private readonly listenKeys: Set<string> = new Set();
    private readonly keys: Set<string> = new Set();

    constructor(private readonly client: Client) {
        client.events.register(MessageRegisterEvent, MessageListenEvent, MessageBroadcastEvent);
        client.connection.addListener(this);
    }

    register(key: Key): void {
        if (this.keys.has(key.name)) {
            throw new Error(`Key ${key.name} already registered`);
        }
        this.keys.add(`${key.app ?? this.client.app.key()}:${key.name}`);
    }

    broadcast<T>(key: Key, value: T): void {
        this.client.send(MessageBroadcastEvent, {
            key: `${key.app ?? this.client.app.key()}:${key.name}`,
            body: value,
        });
    }

    listen<T>(key: Key, handler: (value: T) => void): () => void {
        const keyString = `${key.app ?? this.client.app.key()}:${key.name}`;
        const listener = (event: { key: string; body: any; }): void => {
            if (event.key === keyString) {
                handler(event.body);
            }
        };
        this.listenKeys.add(keyString);
        this.client.events.addListener(MessageBroadcastEvent, listener);
        return () => {
            this.client.events.removeListener(MessageBroadcastEvent, listener);
        };
    }

    onConnect(): void {
        for (const key of this.keys) {
            this.client.send(MessageRegisterEvent, key);
        }
        for (const key of this.listenKeys) {
            this.client.send(MessageListenEvent, key);
        }
    }
}

export const MessageExtensionType = defineExtensionType('message', {
    create: (client: Client) => new MessageExtension(client),
});
export const MessageRegisterEvent = JsonEventType.ofExtension<string>(MessageExtensionType, {
    name: 'register',
});
export const MessageListenEvent = JsonEventType.ofExtension<string>(MessageExtensionType, {
    name: 'listen',
});
export const MessageBroadcastEvent = JsonEventType.ofExtension<{ key: string, body: any }>(MessageExtensionType, {
    name: 'broadcast',
});
