import { App } from '../../app.js';
import type { Client } from '../../client/index.js';
import { Identifier } from '../../identifier.js';
import { PacketType } from '../../network/packet/packet.js';
import { Serializer } from '../../serializer.js';
import { EndpointType } from '../endpoint/endpoint.js';
import { ExtensionType } from '../extension.js';
import type { Table } from '../table/table.js';
import { TableType } from '../table/table.js';

import type { DashboardHandler, DashboardOpenAppResponse } from './dashboard.js';
import { PermissionRequest } from './dashboard.js';

export const DASHBOARD_EXTENSION_TYPE = new ExtensionType(
    'dashboard',
    (client: Client) => new DashboardExtension(client),
);

type DashboardSetResponse = {
    success: boolean;
}
export const DASHBOARD_SET_PERMISSION_ID = DASHBOARD_EXTENSION_TYPE.join('set');
const DASHBOARD_SET_ENDPOINT = EndpointType.createJson<Identifier, DashboardSetResponse>(DASHBOARD_EXTENSION_TYPE, {
    name: 'set',
    requestSerializer: Serializer.model(Identifier),
    permissionId: DASHBOARD_SET_PERMISSION_ID,
});
const DASHBOARD_PERMISSION_REQUEST_PACKET = PacketType.createJson<PermissionRequest>(DASHBOARD_EXTENSION_TYPE, {
    name: 'permission_request',
    serializer: Serializer.model(PermissionRequest),
});
const DASHBOARD_PERMISSION_ACCEPT_PACKET = PacketType.createJson<number>(DASHBOARD_EXTENSION_TYPE, {
    name: 'permission_accept',
});
const DASHBOARD_PERMISSION_DENY_PACKET = PacketType.createJson<number>(DASHBOARD_EXTENSION_TYPE, {
    name: 'permission_deny',
});
export const DASHBOARD_OPEN_APP_PERMISSION_ID = DASHBOARD_EXTENSION_TYPE.join('app', 'open');
const DASHBOARD_OPEN_APP_ENDPOINT = EndpointType.createJson<App, DashboardOpenAppResponse>(DASHBOARD_EXTENSION_TYPE, {
    name: 'open_app',
    requestSerializer: Serializer.model(App),
    permissionId: DASHBOARD_OPEN_APP_PERMISSION_ID,
});
const DASHBOARD_OPEN_APP_PACKET = PacketType.createJson<App>(DASHBOARD_EXTENSION_TYPE, {
    name: 'open_app',
    serializer: Serializer.model(App),
});
export const DASHOBARD_APP_READ_PERMISSION_ID = DASHBOARD_EXTENSION_TYPE.join('app', 'read');
export const DASHOBARD_APP_EDIT_PERMISSION_ID = DASHBOARD_EXTENSION_TYPE.join('app', 'edit');
const DASHBOARD_APP_TABLE_TYPE = TableType.createModel(
    DASHBOARD_EXTENSION_TYPE,
    {
        name: 'apps',
        model: App,
        permissions: {
            read: DASHOBARD_APP_READ_PERMISSION_ID,
            write: DASHOBARD_APP_EDIT_PERMISSION_ID,
            remove: DASHOBARD_APP_EDIT_PERMISSION_ID,
        },
    },
);

export class DashboardExtension {
    private dashboard: DashboardHandler | null = null;
    public readonly apps: Table<App>;

    constructor(private readonly client: Client) {
        client.network.registerPacket(
            DASHBOARD_PERMISSION_REQUEST_PACKET,
            DASHBOARD_PERMISSION_ACCEPT_PACKET,
            DASHBOARD_PERMISSION_DENY_PACKET,
            DASHBOARD_OPEN_APP_PACKET,
        );
        client.network.addPacketHandler(DASHBOARD_PERMISSION_REQUEST_PACKET, (request) => this.handlePermissionRequest(request));
        client.network.addPacketHandler(DASHBOARD_OPEN_APP_PACKET, (app) => this.handleOpenApp(app));
        client.listeners.ready.subscribe(() => this.onReady());

        this.apps = client.tables.get(DASHBOARD_APP_TABLE_TYPE);
    }

    private async onReady(): Promise<void> {
        if (this.dashboard === null) {
            return;
        }
        const response = await this.client.endpoints.call(DASHBOARD_SET_ENDPOINT, this.client.app.identifier);
        if (!response.success) {
            throw new Error('Failed to set dashboard');
        }
    }

    private async handlePermissionRequest(request: PermissionRequest): Promise<void> {
        await this.handleDashboard(async (dashboard) => {
            const response = await dashboard.handlePermissionRequest(request);
            if (response) {
                this.client.send(DASHBOARD_PERMISSION_ACCEPT_PACKET, request.requestId);
            } else {
                this.client.send(DASHBOARD_PERMISSION_DENY_PACKET, request.requestId);
            }
        });
    }

    private async handleOpenApp(app: App): Promise<void> {
        await this.handleDashboard(async (dashboard) => {
            await dashboard.handleOpenApp(app);
        });
    }

    private async handleDashboard(callback: (dashboard: DashboardHandler) => Promise<void>): Promise<void> {
        if (this.dashboard === null) {
            throw new Error('Dashboard not set');
        }
        await callback(this.dashboard);
    }

    public set(dashboard: DashboardHandler): void {
        this.client.permissions.require(DASHBOARD_SET_PERMISSION_ID);
        if (this.dashboard !== null) {
            throw new Error('Dashboard already set');
        }
        this.dashboard = dashboard;
    }

    public async openApp(app: App): Promise<DashboardOpenAppResponse> {
        return await this.client.endpoints.call(DASHBOARD_OPEN_APP_ENDPOINT, app);
    }
}
