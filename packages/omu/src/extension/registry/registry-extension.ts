import type { Client } from '../../client/index.js';
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
    private readonly listeners: Array<(value: T) => void> = [];
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
        if (!result.existing) {
            return this.defaultValue;
        }
        return this.serializer.deserialize(result.value);
    }

    async set(value: T): Promise<void> {
        await this.client.network.waitForConnection();
        this.client.send(REGISTRY_UPDATE_PACKET, {
            key: this.key,
            existing: true,
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
        this.listeners.push(handler);
        return () => {
            this.listeners.splice(this.listeners.indexOf(handler), 1);
        };
    }

    private handleUpdate(data: RegistryPacket): void {
        if (data.key !== this.key) {
            return;
        }
        let value = this.defaultValue;
        if (data.existing) {
            value = this.serializer.deserialize(data.value);
        }
        for (const listener of this.listeners) {
            listener(value);
        }
    }
}

type RegistryPacket = {
    key: string,
    existing: boolean,
    value: Uint8Array,
}

const DATA_SERIALIZER = new Serializer<RegistryPacket, Uint8Array>(
    (data: RegistryPacket) => {
        const writer = new ByteWriter();
        writer.writeString(data.key);
        writer.writeBoolean(data.existing);
        writer.writeByteArray(data.value);
        return writer.finish();
    },
    (data: Uint8Array) => {
        const reader = new ByteReader(data);
        const key = reader.readString();
        const existing = reader.readBoolean();
        const value = reader.readByteArray();
        return { key, existing, value };
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
