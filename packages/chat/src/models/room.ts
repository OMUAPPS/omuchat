import type { Keyable, Model, Timestamped } from '@omuchatjs/omu/interface/index.js';

export type MetadataJson = {
    title?: string,
    description?: string,
    url?: string,
    thumbnail?: string,
    viewers?: number,
    created_at?: string,
    started_at?: string,
    ended_at?: string,
}

export type Status = 'online' | 'reserved' | 'offline'

export type RoomJson = {
    id: string;
    provider_id: string;
    connected: boolean;
    status: Status;
    metadata?: MetadataJson;
    channel_id?: string;
    created_at: string; // ISO 8601 date string
}

export class Room implements Model<RoomJson>, Keyable, Timestamped {
    public id: string;
    public providerId: string;
    public connected: boolean;
    public status: Status;
    public metadata?: MetadataJson;
    public channelId?: string;
    public createdAt: Date;

    constructor(options: RoomJson) {
        this.id = options.id;
        this.providerId = options.provider_id;
        this.connected = options.connected;
        this.status = options.status;
        this.metadata = options.metadata;
        this.channelId = options.channel_id;
        this.createdAt = new Date(options.created_at);
    }
    toString(): string {
        throw new Error('Method not implemented.');
    }

    static fromJson(options: RoomJson): Room {
        return new Room(options);
    }

    toJson(): RoomJson {
        return {
            id: this.id,
            provider_id: this.providerId,
            connected: this.connected,
            status: this.status,
            metadata: this.metadata,
            channel_id: this.channelId,
            created_at: this.createdAt.toISOString(),
        };
    }

    key(): string {
        return `${this.id}@${this.providerId}`;
    }
}
