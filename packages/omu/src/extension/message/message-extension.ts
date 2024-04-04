import type { Client } from '../../client/index.js';
import { ByteReader, ByteWriter } from '../../network/bytebuffer.js';
import { PacketType } from '../../network/packet/index.js';
import { ExtensionType, type Extension } from '../extension.js';

import type { Message } from './message.js';
import { MessageType } from './message.js';

export const MESSAGE_EXTENSION_TYPE = new ExtensionType(
    'message',
    (client: Client) => new MessageExtension(client),
);

type MessagePacket = { key: string; body: Uint8Array };
const MESSAGE_LISTEN_PACKET = PacketType.createJson<string>(MESSAGE_EXTENSION_TYPE, {
    name: 'listen',
});
const MESSAGE_BROADCAST_PACKET = PacketType.createSerialized<MessagePacket>(MESSAGE_EXTENSION_TYPE, {
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
});

export class MessageExtension implements Extension {
    private readonly messageIdentifiers: Set<string> = new Set();

    constructor(private readonly client: Client) {
        client.network.registerPacket(MESSAGE_LISTEN_PACKET, MESSAGE_BROADCAST_PACKET);
    }

    create<T>(name: string): Message<T> {
        const identifier = this.client.app.identifier.join(name);
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
    private listening = false;

    constructor(
        private readonly client: Client,
        private readonly type: MessageType<T>,
    ) {
        client.network.addPacketHandler(MESSAGE_BROADCAST_PACKET, this.handleBroadcast);
    }

    broadcast(body: T): void {
        const data = this.type.serializer.serialize(body);
        this.client.send(MESSAGE_BROADCAST_PACKET, {
            key: this.type.identifier.key(),
            body: data,
        });
    }

    listen(handler: (value: T) => void): () => void {
        this.listeners.push(handler);
        if (!this.listening) {
            this.client.network.addTask(() => {
                this.client.send(MESSAGE_LISTEN_PACKET, this.type.identifier.key());
            });
            this.listening = true;
        }
        return () => {
            this.listeners.splice(this.listeners.indexOf(handler), 1);
        };
    }

    private handleBroadcast(data: MessagePacket): void {
        if (data.key !== this.type.identifier.key()) {
            return;
        }
        const body = this.type.serializer.deserialize(data.body);
        for (const listener of this.listeners) {
            listener(body);
        }
    }
}
