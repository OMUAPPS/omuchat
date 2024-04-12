import type { Client } from '../../client/index.js';
import { EventEmitter } from '../../event-emitter.js';
import type { Identifier } from '../../identifier.js';
import { ByteReader, ByteWriter } from '../../network/bytebuffer.js';
import { PacketType } from '../../network/packet/index.js';
import type { Serializable } from '../../serializer.js';
import { Serializer } from '../../serializer.js';
import { EndpointType } from '../endpoint/endpoint.js';
import { ExtensionType, type Extension } from '../extension.js';

import type { Registry, RegistryType } from './registry.js';

export class RegistryExtension implements Extension {
    constructor(private readonly client: Client) {
        client.network.registerPacket(REGISTRY_UPDATE_PACKET);
    }

    get<T>(registryType: RegistryType<T>): Registry<T> {
        return new RegistryImpl(
            this.client,
            registryType.identifier,
            registryType.defaultValue,
            registryType.serializer,
        );
    }

    create<T>(name: string, defaultValue: T): Registry<T> {
        return new RegistryImpl(
            this.client,
            this.client.app.identifier.join(name),
            defaultValue,
            Serializer.json(),
        );
    }
}

class RegistryImpl<T> implements Registry<T> {
    private readonly eventHandlers: EventEmitter<(value: T) => void> = new EventEmitter();
    private listening = false;
    private key: string;

    constructor(
        private readonly client: Client,
        identifier: Identifier,
        private readonly defaultValue: T,
        private readonly serializer: Serializable<T, Uint8Array>,
    ) {
        this.key = identifier.key();
        client.network.addPacketHandler(REGISTRY_UPDATE_PACKET, (data) => this.handleUpdate(data));
    }

    async get(): Promise<T> {
        await this.client.network.waitForConnection();
        const result = await this.client.endpoints.call(REGISTRY_GET_ENDPOINT, this.key);
        if (result.value === null) {
            return this.defaultValue;
        }
        return this.serializer.deserialize(result.value);
    }

    async set(value: T): Promise<void> {
        await this.client.network.waitForConnection();
        this.client.send(REGISTRY_UPDATE_PACKET, {
            key: this.key,
            value: this.serializer.serialize(value),
        });
    }

    async update(fn: (value: T) => T): Promise<void> {
        await this.client.network.waitForConnection();
        const value = await this.get();
        const newValue = await fn(value);
        await this.set(newValue);
    }

    listen(handler: (value: T) => void): () => void {
        if (!this.listening) {
            this.client.network.addTask(() => {
                this.client.send(REGISTRY_LISTEN_PACKET, this.key);
            });
            this.listening = true;
        }
        this.eventHandlers.subscribe(handler);
        return () => {
            this.eventHandlers.unsubscribe(handler);
        };
    }

    private handleUpdate(data: RegistryPacket): void {
        if (data.key !== this.key) {
            return;
        }
        let value = this.defaultValue;
        if (data.value !== null) {
            value = this.serializer.deserialize(data.value);
        }
        this.eventHandlers.emit(value);
    }
}

type RegistryPacket = {
    key: string,
    value: Uint8Array | null,
}

const DATA_SERIALIZER = new Serializer<RegistryPacket, Uint8Array>(
    (data: RegistryPacket) => {
        const writer = new ByteWriter();
        writer.writeString(data.key);
        writer.writeBoolean(data.value !== null);
        if (data.value !== null) {
            writer.writeByteArray(data.value);
        }
        return writer.finish();
    },
    (data: Uint8Array) => {
        const reader = new ByteReader(data);
        const key = reader.readString();
        const existing = reader.readBoolean();
        let value: Uint8Array | null = null;
        if (existing) {
            value = reader.readByteArray();
        }
        return {
            key,
            value,
        };
    },
);

export const REGISTRY_EXTENSION_TYPE = new ExtensionType(
    'registry',
    (client: Client) => new RegistryExtension(client),
);
const REGISTRY_UPDATE_PACKET = PacketType.createSerialized<RegistryPacket>(REGISTRY_EXTENSION_TYPE, {
    name: 'update',
    serializer: DATA_SERIALIZER,
});
const REGISTRY_LISTEN_PACKET = PacketType.createJson<string>(REGISTRY_EXTENSION_TYPE, {
    name: 'listen',
});
const REGISTRY_GET_ENDPOINT = EndpointType.createSerialized<string, RegistryPacket>(REGISTRY_EXTENSION_TYPE, {
    name: 'get',
    requestSerializer: Serializer.json(),
    responseSerializer: DATA_SERIALIZER,
});
