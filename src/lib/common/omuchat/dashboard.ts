import type { Client } from '@omuchatjs/chat';
import { TableType, type Table } from '@omuchatjs/omu/extension/table/table.js';

import { Identifier } from '@omuchatjs/omu/identifier.js';
import { AppMetadata } from './app-metadata.js';
import { Asset } from './asset.js';
import { BookmarkEntry } from './bookmark.js';

export const IDENTIFIER = Identifier.fromKey('cc.omuchat:dashboard');

export const AppsTableKey = TableType.model(IDENTIFIER, {
    name: 'apps',
    model: AppMetadata,
});
export const AssetsTableKey = TableType.model(IDENTIFIER, {
    name: 'assets',
    model: Asset,
});
export const BookmarksTableKey = TableType.model(IDENTIFIER, {
    name: 'bookmarks',
    model: BookmarkEntry,
});


export class Dashboard {
    readonly apps: Table<AppMetadata>;
    readonly assets: Table<Asset>;
    readonly bookmarks: Table<BookmarkEntry>;

    constructor(client: Client) {
        this.apps = client.tables.get(AppsTableKey);
        this.assets = client.tables.get(AssetsTableKey);
        this.bookmarks = client.tables.get(BookmarksTableKey);
    }
}
