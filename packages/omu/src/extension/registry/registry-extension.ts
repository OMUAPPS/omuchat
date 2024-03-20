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
        client.network.registerPacket(RegistryUpdateEvent);
    }

    get<T>(registryType: RegistryType<T>): Registry<T> {
        return new RegistryImpl(
            this.client,
            registryType.identifier,
            registryType.defaultValue,
            registryType.serializer,
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
        client.network.addPacketHandler(RegistryUpdateEvent, (data) => this.handleUpdate(data));
    }

    async get(): Promise<T> {
        const result = await this.client.endpoints.call(RegistryGetEndpoint, this.key);
        if (!result.existing) {
            return this.defaultValue;
        }
        return this.serializer.deserialize(result.value);
    }

    async update(fn: (value: T) => T): Promise<void> {
        const value = await this.get();
        const newValue = await fn(value);
        this.client.send(RegistryUpdateEvent, {
            key: this.key,
            existing: true,
            value: this.serializer.serialize(newValue),
        });
    }

    listen(handler: (value: T) => void): () => void {
        if (!this.listening) {
            this.client.network.addTask(() => {
                this.client.send(RegistryListenEvent, this.key);
            });
            this.listening = true;
        }
        this.listeners.push(handler);
        return () => {
            this.listeners.splice(this.listeners.indexOf(handler), 1);
        };
    }

    private handleUpdate(data: RegistryData): void {
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

type RegistryData = {
    key: string,
    existing: boolean,
    value: Uint8Array,
}

const DATA_SERIALIZER = new Serializer<RegistryData, Uint8Array>(
    (data: RegistryData) => {
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

export const RegistryExtensionType = new ExtensionType(
    'registry',
    (client: Client) => new RegistryExtension(client),
);
export const RegistryUpdateEvent = PacketType.createSerialized<RegistryData>(
    RegistryExtensionType,
    {
        name: 'update',
        serializer: DATA_SERIALIZER,
    },
);
export const RegistryListenEvent = PacketType.createJson<string>(RegistryExtensionType, {
    name: 'listen',
});
export const RegistryGetEndpoint = EndpointType.createSerialized<string, RegistryData>(
    RegistryExtensionType,
    {
        name: 'get',
        requestSerializer: Serializer.json(),
        responseSerializer: DATA_SERIALIZER,
    },
);
