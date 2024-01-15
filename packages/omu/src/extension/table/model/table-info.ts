import type { Keyable, Model } from '../../../interface/index.js';
import type { ExtensionType } from '../../extension.js';
import type { App } from '../../server/index.js';

export interface TableInfoJson {
    owner: string;
    name: string;
    description?: string;
    use_database?: boolean;
    cache?: boolean;
    cache_size?: number;
}

export class TableInfo implements Keyable, Model<TableInfoJson> {
    public owner: string;
    public name: string;
    public description?: string;
    public useDatabase?: boolean;
    public cache?: boolean;
    public cacheSize?: number;

    constructor({
        owner,
        name,
        description,
        useDatabase,
        cache,
        cacheSize,
    }: {
        owner: string;
        name: string;
        description?: string;
        useDatabase?: boolean;
        cache?: boolean;
        cacheSize?: number;
    }) {
        this.owner = owner;
        this.name = name;
        this.description = description;
        this.useDatabase = useDatabase;
        this.cache = cache;
        this.cacheSize = cacheSize;
    }

    static fromJson(json: TableInfoJson): TableInfo {
        return new TableInfo(json);
    }

    static of(app: App, {
        name,
        description,
        useDatabase,
        cache,
        cacheSize,
    }: {
        name: string;
        description?: string;
        useDatabase?: boolean;
        cache?: boolean;
        cacheSize?: number;
    }): TableInfo {
        return new TableInfo({
            owner: app.key(),
            name,
            description,
            useDatabase,
            cache,
            cacheSize,
        });
    }

    static ofExtension(extensionType: ExtensionType, {
        name,
        description,
        useDatabase,
        cache,
        cacheSize,
    }: {
        name: string;
        description?: string;
        useDatabase?: boolean;
        cache?: boolean;
        cacheSize?: number;
    }): TableInfo {
        return new TableInfo({
            owner: extensionType.key,
            name,
            description,
            useDatabase,
            cache,
            cacheSize,
        });
    }

    key(): string {
        return `${this.owner}:${this.name}`;
    }

    toJson(): TableInfoJson {
        return {
            owner: this.owner,
            name: this.name,
            description: this.description,
            use_database: this.useDatabase,
            cache: this.cache,
            cache_size: this.cacheSize,
        };
    }
}
