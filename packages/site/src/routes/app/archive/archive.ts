import type { Keyable } from '@omujs/omu/interface.js';
import type { Model } from '@omujs/omu/model.js';

export type ArchiveStatus = 'pending' | 'processing' | 'completed' | 'failed';

type ArchiveData = {
    id: string;
    url: string;
    path: string;
    title: string;
    description: string;
    thumbnail: string;
    publishedAt: string;
    duration: number;
    status: ArchiveStatus;
};

export class Archive implements Model<ArchiveData>, Keyable {
    public readonly id: string;
    public readonly url: string;
    public readonly path: string;
    public readonly title: string;
    public readonly description: string;
    public readonly thumbnail: string;
    public readonly publishedAt: string;
    public readonly duration: number;
    public status: ArchiveStatus;

    constructor(data: ArchiveData) {
        this.id = data.id;
        this.url = data.url;
        this.path = data.path;
        this.title = data.title;
        this.description = data.description;
        this.thumbnail = data.thumbnail;
        this.publishedAt = data.publishedAt;
        this.duration = data.duration;
        this.status = data.status;
    }

    public key(): string {
        return this.id;
    }

    public static fromJson(data: ArchiveData): Archive {
        return new Archive(data);
    }

    public toJson(): ArchiveData {
        return {
            id: this.id,
            url: this.url,
            path: this.path,
            title: this.title,
            description: this.description,
            thumbnail: this.thumbnail,
            publishedAt: this.publishedAt,
            duration: this.duration,
            status: this.status,
        };
    }
}

export type ArchiveConfig = {
    active: boolean;
    yt_dlp_info: {
        version: string;
        git_head: string;
        variant: string;
        update_hint: string;
        channel: string;
        origin: string;
    };
    yt_dlp_options: {
        [key: string]: string;
    };
    output_dir: string;
    archive_limit: {
        size_mb: number;
        count: number;
        duration_days: number;
    };
};
