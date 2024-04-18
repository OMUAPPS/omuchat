import type { Client } from '../../client/index.js';
import { ByteReader, ByteWriter } from '../../network/bytebuffer.js';
import { PacketType } from '../../network/packet/index.js';
import { ExtensionType, type Extension } from '../extension.js';
import { Signal, SignalType } from './signal.js';


export const SIGNAL_EXTENSION_TYPE = new ExtensionType(
    'signal',
    (client: Client) => new SignalExtension(client),
);

type SignalPacket = { key: string; body: Uint8Array };
const SIGNAL_LISTEN_PACKET = PacketType.createJson<string>(SIGNAL_EXTENSION_TYPE, {
    name: 'listen',
});
const SIGNAL_BROADCAST_PACKET = PacketType.createSerialized<SignalPacket>(SIGNAL_EXTENSION_TYPE, {
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

export class SignalExtension implements Extension {
    private readonly signals: Set<string> = new Set();

    constructor(private readonly client: Client) {
        client.network.registerPacket(SIGNAL_LISTEN_PACKET, SIGNAL_BROADCAST_PACKET);
    }

    public create<T>(name: string): Signal<T> {
        const identifier = this.client.app.identifier.join(name);
        if (this.signals.has(identifier.key())) {
            throw new Error(`Signal for key ${identifier.key()} already created`);
        }
        this.signals.add(identifier.key());
        const type = SignalType.createJson<T>(identifier, { name });
        return new SignalImpl<T>(this.client, type);
    }

    public get<T>(signalType: SignalType<T>): Signal<T> {
        return new SignalImpl<T>(this.client, signalType);
    }
}

class SignalImpl<T> implements Signal<T> {
    private readonly listeners: ((value: T) => void)[] = [];
    private listening = false;

    constructor(
        private readonly client: Client,
        private readonly type: SignalType<T>,
    ) {
        client.network.addPacketHandler(SIGNAL_BROADCAST_PACKET, (data) => this.handleBroadcast(data));
    }

    broadcast(body: T): void {
        const data = this.type.serializer.serialize(body);
        this.client.send(SIGNAL_BROADCAST_PACKET, {
            key: this.type.identifier.key(),
            body: data,
        });
    }

    listen(handler: (value: T) => void): () => void {
        this.listeners.push(handler);
        if (!this.listening) {
            this.client.network.addTask(() => {
                this.client.send(SIGNAL_LISTEN_PACKET, this.type.identifier.key());
            });
            this.listening = true;
        }
        return () => {
            this.listeners.splice(this.listeners.indexOf(handler), 1);
        };
    }

    private handleBroadcast(data: SignalPacket): void {
        if (data.key !== this.type.identifier.key()) {
            return;
        }
        const body = this.type.serializer.deserialize(data.body);
        for (const listener of this.listeners) {
            listener(body);
        }
    }
}
