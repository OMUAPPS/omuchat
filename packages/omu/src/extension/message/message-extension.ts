import type { Client } from '../../client/index.js';
import type { ConnectionListener } from '../../network/index.js';
import { JsonEventType, SerializeEventType } from '../../event/index.js';
import { ExtensionType, type Extension } from '../extension.js';
import { Message, MessageType } from './message.js';
import { Identifier } from '../../identifier.js';
import { ByteReader, ByteWriter } from '../../network/bytebuffer.js';

export const MessageExtensionType = new ExtensionType(
    'message',
    (client: Client) => new MessageExtension(client),
);
export const MessageListenEvent = JsonEventType.ofExtension<string>(MessageExtensionType, {
    name: 'listen',
});
type MessageData = { key: string; body: Uint8Array };
export const MessageBroadcastEvent = SerializeEventType.ofExtension<MessageData>(
    MessageExtensionType,
    {
        name: 'broadcast',
        serializer: {
            serialize: (data) => {
                const writer = new ByteWriter();
                writer.writeString(data.key);
                writer.writeByteArray(data.body);
                return writer.finish();
            },
            deserialize: (data) => {
                const reader = new ByteReader(data);
                const key = reader.readString();
                const body = reader.readByteArray();
                reader.finish();
                return { key, body };
            },
        },
    },
);

export class MessageExtension implements Extension {
    private readonly messageIdentifiers: Set<string> = new Set();


    constructor(private readonly client: Client) {
        client.events.register(MessageListenEvent, MessageBroadcastEvent);
    }

    create<T>(name: string): Message<T> {
        const identifier = this.client.app.identifer.join(name);
        if (this.messageIdentifiers.has(identifier.key())) {
            throw new Error(`Message for key ${identifier.key()} already created`);
        }
        this.messageIdentifiers.add(identifier.key());
        const type = MessageType.createJson<T>(identifier, name);
        return new MessageImpl<T>(this.client, type);
    }
}

class MessageImpl<T> implements Message<T> {
    private readonly listeners: ((value: T) => void)[] = [];
    private listening: boolean = false;

    constructor(
        private readonly client: Client,
        private readonly type: MessageType<T>,
    ) {
        client.events.addListener(MessageBroadcastEvent, this.handleBroadcast);
    }

    broadcast(body: T): void {
        const data = this.type.serializer.serialize(body);
        this.client.send(MessageBroadcastEvent, {
            key: this.type.identifier.key(),
            body: data,
        });
    }

    listen(handler: (value: T) => void): () => void {
        this.listeners.push(handler);
        if (!this.listening) {
            this.client.connection.addTask(() => {
                this.client.send(MessageListenEvent, this.type.identifier.key());
            });
            this.listening = true;
        }
        return () => {
            this.listeners.splice(this.listeners.indexOf(handler), 1);
        };
    }

    private handleBroadcast(data: MessageData): void {
        if (data.key !== this.type.identifier.key()) {
            return;
        }
        const body = this.type.serializer.deserialize(data.body);
        for (const listener of this.listeners) {
            listener(body);
        }
    }
}
