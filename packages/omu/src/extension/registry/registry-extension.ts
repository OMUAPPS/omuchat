import type { Client } from '../../client/index.js';
import { EventEmitter } from '../../event-emitter.js';
import { Identifier, IdentifierMap } from '../../identifier.js';
import { ByteReader, ByteWriter } from '../../network/bytebuffer.js';
import { PacketType } from '../../network/packet/index.js';
import type { Serializable } from '../../serializer.js';
import { Serializer } from '../../serializer.js';
import { EndpointType } from '../endpoint/endpoint.js';
import { ExtensionType, type Extension } from '../extension.js';

import type { Registry, RegistryType } from './registry.js';

export class RegistryExtension implements Extension {
    private readonly registries = new IdentifierMap<Registry<unknown>>();

    constructor(private readonly client: Client) {
        client.network.registerPacket(REGISTRY_UPDATE_PACKET);
    }

    private createRegistry<T>(registryType: RegistryType<T>): Registry<T> {
        this.client.permissions.require(REGISTRY_PERMISSION_ID);
        return new RegistryImpl(
            this.client,
            registryType,
        );
    }

    public get<T>(registryType: RegistryType<T>): Registry<T> {
        const identifier = registryType.identifier;
        let registry = this.registries.get(identifier);
        if (registry === undefined) {
            registry = this.createRegistry(registryType);
            this.registries.set(identifier, registry);
        }
        return registry as Registry<T>;
    }

    public create<T>(name: string, defaultValue: T): Registry<T> {
        const identifier = this.client.app.identifier.join(name);
        if (this.registries.has(identifier)) {
            throw new Error(`Registry with name '${name}' already exists`);
        }
        return this.createRegistry({
            identifier,
            defaultValue,
            serializer: Serializer.json(),
        });
    }
}

class RegistryImpl<T> implements Registry<T> {
    private readonly eventHandlers: EventEmitter<(value: T) => void> = new EventEmitter();
    private listening = false;
    private readonly identifier: Identifier;
    private readonly defaultValue: T;
    private readonly serializer: Serializable<T, Uint8Array>;

    constructor(
        private readonly client: Client,
        public readonly type: RegistryType<T>,
    ) {
        this.identifier = type.identifier;
        this.defaultValue = type.defaultValue;
        this.serializer = type.serializer;
        client.network.addPacketHandler(REGISTRY_UPDATE_PACKET, (data) => this.handleUpdate(data));
    }

    public async get(): Promise<T> {
        await this.client.network.waitForConnection();
        const result = await this.client.endpoints.call(REGISTRY_GET_ENDPOINT, this.identifier);
        if (result.value === null) {
            return this.defaultValue;
        }
        return this.serializer.deserialize(result.value);
    }

    public async set(value: T): Promise<void> {
        await this.client.network.waitForConnection();
        this.client.send(REGISTRY_UPDATE_PACKET, {
            identifier: this.identifier,
            value: this.serializer.serialize(value),
        });
    }

    public async update(fn: (value: T) => T): Promise<void> {
        await this.client.network.waitForConnection();
        const value = await this.get();
        const newValue = await fn(value);
        await this.set(newValue);
    }

    public listen(handler: (value: T) => void): () => void {
        if (!this.listening) {
            this.client.network.addTask(() => {
                this.client.send(REGISTRY_LISTEN_PACKET, this.identifier);
            });
            this.listening = true;
        }
        this.eventHandlers.subscribe(handler);
        return () => {
            this.eventHandlers.unsubscribe(handler);
        };
    }

    private handleUpdate(data: RegistryPacket): void {
        if (!data.identifier.isEqual(this.identifier)) {
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
    identifier: Identifier,
    value: Uint8Array | null,
}

const DATA_SERIALIZER = new Serializer<RegistryPacket, Uint8Array>(
    (data: RegistryPacket) => {
        const writer = new ByteWriter();
        writer.writeString(data.identifier.key());
        writer.writeBoolean(data.value !== null);
        if (data.value !== null) {
            writer.writeByteArray(data.value);
        }
        return writer.finish();
    },
    (data: Uint8Array) => {
        const reader = new ByteReader(data);
        const identifier = Identifier.fromKey(reader.readString());
        const existing = reader.readBoolean();
        let value: Uint8Array | null = null;
        if (existing) {
            value = reader.readByteArray();
        }
        return {
            identifier: identifier,
            value,
        };
    },
);

export const REGISTRY_EXTENSION_TYPE = new ExtensionType(
    'registry',
    (client: Client) => new RegistryExtension(client),
);
export const REGISTRY_PERMISSION_ID = REGISTRY_EXTENSION_TYPE.join('permission');
const REGISTRY_UPDATE_PACKET = PacketType.createSerialized<RegistryPacket>(REGISTRY_EXTENSION_TYPE, {
    name: 'update',
    serializer: DATA_SERIALIZER,
});
const REGISTRY_LISTEN_PACKET = PacketType.createJson<Identifier>(REGISTRY_EXTENSION_TYPE, {
    name: 'listen',
    serializer: Serializer.model(Identifier),
});
const REGISTRY_GET_ENDPOINT = EndpointType.createSerialized<Identifier, RegistryPacket>(REGISTRY_EXTENSION_TYPE, {
    name: 'get',
    requestSerializer: Serializer.model(Identifier).toJson(),
    responseSerializer: DATA_SERIALIZER,
    permissionId: REGISTRY_PERMISSION_ID,
});
