import type { Keyable, Model } from '@omuchatjs/omu/interface/index.js';

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
    providerId: string;
    connected: boolean;
    status: Status;
    metadata?: MetadataJson;
    channelId?: string;
}

export class Room implements Keyable, Model<RoomJson> {
    public id: string;
    public providerId: string;
    public connected: boolean;
    public status: Status;
    public metadata?: MetadataJson;
    public channelId?: string;

    constructor(options: RoomJson) {
        this.id = options.id;
        this.providerId = options.providerId;
        this.connected = options.connected;
        this.status = options.status;
        this.metadata = options.metadata;
        this.channelId = options.channelId;
    }

    static fromJson(options: RoomJson): Room {
        return new Room(options);
    }

    toJson(): RoomJson {
        return {
            id: this.id,
            providerId: this.providerId,
            connected: this.connected,
            status: this.status,
            metadata: this.metadata,
            channelId: this.channelId,
        };
    }

    key(): string {
        return `${this.id}@${this.providerId}`;
    }
}
