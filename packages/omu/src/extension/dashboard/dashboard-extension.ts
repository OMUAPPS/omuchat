import { Identifier } from '../../identifier.js';
import type { Client } from '../../index.js';
import { PacketType } from '../../network/packet/packet.js';
import { Serializer } from '../../serializer.js';
import { EndpointType } from '../endpoint/endpoint.js';
import { ExtensionType } from '../extension.js';

import type { DashboardHandler } from './dashboard.js';
import { PermissionRequest } from './dashboard.js';

export class DashboardExtension {
    private dashboard: DashboardHandler | null = null;

    constructor(private readonly client: Client) {
        client.network.registerPacket(
            DASHBOARD_PERMISSION_REQUEST_PACKET,
            DASHBOARD_PERMISSION_ACCEPT_PACKET,
            DASHBOARD_PERMISSION_DENY_PACKET,
        );
        client.network.addPacketHandler(DASHBOARD_PERMISSION_REQUEST_PACKET, async (request) => this.handlePermissionRequest(request));
        client.network.listeners.connected.subscribe(() => this.handleConnected());
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

    private async handleDashboard(callback: (dashboard: DashboardHandler) => Promise<void>): Promise<void> {
        if (this.dashboard === null) {
            throw new Error('Dashboard not set');
        }
        await callback(this.dashboard);
    }

    private async handleConnected(): Promise<void> {
        if (this.dashboard === null) {
            return;
        }
        const response = await this.client.endpoints.call(DASHBOARD_SET_ENDPOINT, this.client.app.identifier);
        if (!response.success) {
            throw new Error('Failed to set dashboard');
        }
    }

    public set(dashboard: DashboardHandler): void {
        if (this.dashboard !== null) {
            throw new Error('Dashboard already set');
        }
        this.dashboard = dashboard;
    }
}

export const DASHBOARD_EXTENSION_TYPE = new ExtensionType(
    'dashboard',
    (client: Client) => new DashboardExtension(client),
);

type DashboardSetResponse = {
    success: boolean;
}

const DASHBOARD_SET_ENDPOINT = EndpointType.createJson<Identifier, DashboardSetResponse>(DASHBOARD_EXTENSION_TYPE, {
    name: 'set',
    requestSerializer: Serializer.model(Identifier),
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
