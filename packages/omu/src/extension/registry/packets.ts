import { Identifier } from '../../identifier.js';
import { ByteReader, ByteWriter } from '../../network/bytebuffer.js';

import { RegistryPermissions } from './registry.js';

export class RegistryPacket {
    constructor(
        public readonly id: Identifier,
        public readonly value: Uint8Array | null,
    ) { }

    public static serialize(packet: RegistryPacket): Uint8Array {
        const writer = new ByteWriter();
        writer.writeString(packet.id.key());
        writer.writeBoolean(packet.value !== null);
        if (packet.value !== null) {
            writer.writeByteArray(packet.value);
        }
        return writer.finish();
    }

    public static deserialize(data: Uint8Array): RegistryPacket {
        const reader = new ByteReader(data);
        const id = Identifier.fromKey(reader.readString());
        const existing = reader.readBoolean();
        const value = existing ? reader.readByteArray() : null;
        return new RegistryPacket(id, value);
    }
}

export class RegistryRegisterPacket {
    constructor(
        public readonly id: Identifier,
        public readonly permissions: RegistryPermissions,
    ) { }

    public static serialize(packet: RegistryRegisterPacket): Uint8Array {
        const writer = new ByteWriter();
        writer.writeString(packet.id.key());
        packet.permissions.serialize(writer);
        return writer.finish();
    }

    public static deserialize(data: Uint8Array): RegistryRegisterPacket {
        const reader = new ByteReader(data);
        const id = Identifier.fromKey(reader.readString());
        const permissions = RegistryPermissions.deserialize(reader);
        return new RegistryRegisterPacket(id, permissions);
    }
}
