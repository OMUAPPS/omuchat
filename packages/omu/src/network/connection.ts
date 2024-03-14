import type { Serializable } from '../serializer.js';

import type { PacketData, PacketType } from './packet/index.js';
import type { Packet } from './packet/packet.js';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export class PacketMapper implements Serializable<Packet, PacketData> {
    private readonly map = new Map<string, PacketType<unknown>>();

    public register(...packetTypes: PacketType<unknown>[]): void {
        for (const type of packetTypes) {
            if (this.map.has(type.identifier.key())) {
                throw new Error(`Packet id ${type.identifier.key()} already registered`);
            }
            this.map.set(type.identifier.key(), type);
        }
    }

    serialize(packet: Packet): PacketData {
        return {
            type: packet.type.identifier.key(),
            data: packet.type.serializer.serialize(packet.data),
        };
    }

    deserialize(data: PacketData): Packet {
        const type = this.map.get(data.type);
        if (!type) throw new Error(`Packet type ${data.type} not registered`);
        return {
            type,
            data: type.serializer.deserialize(data.data),
        };
    }
}

export interface Connection {
    connect(): Promise<void>;
    send(packet: Packet, serializer: Serializable<Packet, PacketData>): void;
    receive(serializer: Serializable<Packet, PacketData>): Promise<Packet>;
    close(): void;
    closed: boolean;
}
