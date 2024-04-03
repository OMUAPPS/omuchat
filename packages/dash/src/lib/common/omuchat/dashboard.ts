import type { Client } from '@omuchatjs/chat';
import type { DashboardHandler, PermissionRequest } from '@omuchatjs/omu/extension/dashboard/dashboard.js';
import { TableType, type Table } from '@omuchatjs/omu/extension/table/table.js';
import { Identifier } from '@omuchatjs/omu/identifier.js';
import PermissionRequestScreen from '../screen/PermissionRequestScreen.svelte';
import { screenContext } from '../screen/screen.js';
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


export class Dashboard implements DashboardHandler {
    readonly apps: Table<AppMetadata>;
    readonly assets: Table<Asset>;
    readonly bookmarks: Table<BookmarkEntry>;

    constructor(client: Client) {
        this.apps = client.tables.get(AppsTableKey);
        this.assets = client.tables.get(AssetsTableKey);
        this.bookmarks = client.tables.get(BookmarksTableKey);
        client.dashboard.set(this);
    }

    handlePermissionRequest(request: PermissionRequest): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            screenContext.push(PermissionRequestScreen, {
                request,
                resolve: (accept: boolean) => resolve(accept),
            });
        });
    }
}
