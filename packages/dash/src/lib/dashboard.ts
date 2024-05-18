import { currentPage } from '$lib/main/settings.js';
import { tauriWindow } from '$lib/utils/tauri.js';
import { App, Omu } from '@omujs/omu';
import type { DashboardHandler } from '@omujs/omu/extension/dashboard/dashboard.js';
import type {
    PermissionRequestPacket,
    PluginRequestPacket,
} from '@omujs/omu/extension/dashboard/packets.js';
import { Identifier } from '@omujs/omu/identifier.js';
import type { Locale } from '@omujs/omu/localization/locale.js';
import { screenContext } from './common/screen/screen.js';
import { omu } from './client.js';
import PermissionRequestScreen from '$lib/common/screen/PermissionRequestScreen.svelte';
import PluginRequestScreen from '$lib/common/screen/PluginRequestScreen.svelte';
import type { Table } from '@omujs/omu/extension/table/table.js';

export const IDENTIFIER = Identifier.fromKey('com.omuapps:dashboard');

export class Dashboard implements DashboardHandler {
    readonly apps: Table<App>;

    constructor(omu: Omu) {
        this.apps = omu.dashboard.apps;
        omu.dashboard.set(this);
        omu.whenReady(() => {
            omu.i18n.setLocale(window.navigator.languages as Locale[]);
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
        const windowTitle = omu.i18n.translate(app.metadata?.name ?? app.id.key());
        const window = new tauriWindow.WebviewWindow(windowLabel, {
            url: app.url,
            title: windowTitle,
            fileDropEnabled: true,
            transparent: true,
        });
        window.setFocus();
    }
}
