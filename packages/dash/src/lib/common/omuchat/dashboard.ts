import { tauriWindow } from '$lib/utils/tauri.js';
import { type Client } from '@omuchatjs/chat';
import { App } from '@omuchatjs/omu';
import type { DashboardHandler, PermissionRequest } from '@omuchatjs/omu/extension/dashboard/dashboard.js';
import { TableType, type Table } from '@omuchatjs/omu/extension/table/table.js';
import { Identifier } from '@omuchatjs/omu/identifier.js';
import type { Locale } from '@omuchatjs/omu/localization/locale.js';
import PermissionRequestScreen from '../screen/PermissionRequestScreen.svelte';
import { screenContext } from '../screen/screen.js';
import { Asset } from './asset.js';
import { BookmarkEntry } from './bookmark.js';
import { client } from './client.js';

export const IDENTIFIER = Identifier.fromKey('cc.omuchat:dashboard');

export const AppsTableKey = TableType.model(IDENTIFIER, {
    name: 'apps',
    model: App,
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
    readonly apps: Table<App>;
    readonly assets: Table<Asset>;
    readonly bookmarks: Table<BookmarkEntry>;

    constructor(client: Client) {
        this.apps = client.tables.get(AppsTableKey);
        this.assets = client.tables.get(AssetsTableKey);
        this.bookmarks = client.tables.get(BookmarksTableKey);
        client.dashboard.set(this);
        client.i18n.setLocale(window.navigator.languages as Locale[]);
    }

    async handlePermissionRequest(request: PermissionRequest): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            screenContext.push(PermissionRequestScreen, {
                request,
                resolve: (accept: boolean) => resolve(accept),
            });
        });
    }

    async handleOpenApp(app: App): Promise<void> {
        const windowLabel = app.identifier.namespace.replace(/\./g, '-') + '-' + btoa(app.identifier.key()).replace(/=/g, '');
        const windowTitle = client.i18n.translate(app.localizations?.name ?? app.identifier.key());
        const window = new tauriWindow.WebviewWindow(windowLabel, { url: app.url, title: windowTitle });
        window.setFocus();
    }

}
