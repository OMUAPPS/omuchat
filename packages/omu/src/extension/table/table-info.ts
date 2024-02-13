import { Identifier } from '../../identifier.js';
import type { Keyable, Model } from '../../interface/index.js';
import type { ExtensionType } from '../extension.js';
import type { App } from '../server/index.js';

export interface TableInfoJson {
    identifier: string;
    cache_size?: number;
}

export class TableInfo implements Keyable, Model<TableInfoJson> {
    public identifier: Identifier;
    public cacheSize?: number;

    constructor({
        identifier,
        cacheSize,
    }: {
        identifier: Identifier;
        cacheSize?: number;
    }) {
        this.identifier = identifier;
        this.cacheSize = cacheSize;
    }

    static fromJson(json: TableInfoJson): TableInfo {
        return new TableInfo({
            identifier: Identifier.fromKey(json.identifier),
            cacheSize: json.cache_size,
        });
    }

    static of(app: App, {
        name,
        cacheSize,
    }: {
        name: string;
        cacheSize?: number;
    }): TableInfo {
        return new TableInfo({
            identifier: Identifier.create(app.key(), name),
            cacheSize,
        });
    }

    static ofExtension(extensionType: ExtensionType, {
        name,
        cacheSize,
    }: {
        name: string;
        cacheSize?: number;
    }): TableInfo {
        return new TableInfo({
            identifier: Identifier.create(extensionType.name, name),
            cacheSize,
        });
    }

    key(): string {
        return this.identifier.key();
    }

    toJson(): TableInfoJson {
        return {
            identifier: this.identifier.key(),
            cache_size: this.cacheSize,
        };
    }
}
