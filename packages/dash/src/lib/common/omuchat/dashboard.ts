import { currentPage } from '$lib/main/settings.js';
import { tauriWindow } from '$lib/utils/tauri.js';
import { type Client } from '@omuchatjs/chat';
import { App } from '@omuchatjs/omu';
import type { DashboardHandler } from '@omuchatjs/omu/extension/dashboard/dashboard.js';
import type {
    PermissionRequestPacket,
    PluginRequestPacket,
} from '@omuchatjs/omu/extension/dashboard/packets.js';
import { TableType, type Table } from '@omuchatjs/omu/extension/table/index.js';
import { Identifier } from '@omuchatjs/omu/identifier.js';
import type { Locale } from '@omuchatjs/omu/localization/locale.js';
import { screenContext } from '../screen/screen.js';
import { BookmarkEntry } from './bookmark.js';
import { client } from './client.js';
import PermissionRequestScreen from '$lib/common/screen/PermissionRequestScreen.svelte';
import PluginRequestScreen from '$lib/common/screen/PluginRequestScreen.svelte';

export const IDENTIFIER = Identifier.fromKey('cc.omuchat:dashboard');
export const BookmarksTableKey = TableType.createModel(IDENTIFIER, {
    name: 'bookmarks',
    model: BookmarkEntry,
});

export class Dashboard implements DashboardHandler {
    readonly apps: Table<App>;
    readonly bookmarks: Table<BookmarkEntry>;

    constructor(client: Client) {
        this.apps = client.dashboard.apps;
        this.bookmarks = client.tables.get(BookmarksTableKey);
        client.dashboard.set(this);
        client.whenReady(() => {
            client.i18n.setLocale(window.navigator.languages as Locale[]);
        });
        this.apps.event.add.listen(() => {
            tauriWindow.appWindow.setFocus();
            currentPage.set('main');
        });
    }

    async handlePermissionRequest(request: PermissionRequestPacket): Promise<boolean> {
        await tauriWindow.appWindow.setFocus();
        return new Promise<boolean>((resolve) => {
            screenContext.push(PermissionRequestScreen, {
                request,
                resolve: (accept: boolean) => resolve(accept),
            });
        });
    }

    async handlePluginRequest(request: PluginRequestPacket): Promise<boolean> {
        await tauriWindow.appWindow.setFocus();
        return new Promise<boolean>((resolve) => {
            screenContext.push(PluginRequestScreen, {
                request,
                resolve: (accept: boolean) => resolve(accept),
            });
        });
    }

    async handleOpenApp(app: App): Promise<void> {
        const windowLabel =
            app.id.namespace.replace(/\./g, '-') + '-' + btoa(app.id.key()).replace(/=/g, '');
        const windowTitle = client.i18n.translate(app.metadata?.name ?? app.id.key());
        const window = new tauriWindow.WebviewWindow(windowLabel, {
            url: app.url,
            title: windowTitle,
            fileDropEnabled: true,
            transparent: true,
        });
        window.setFocus();
    }
}
