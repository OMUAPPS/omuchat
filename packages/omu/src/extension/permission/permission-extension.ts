import type { Client } from '../../client/index.js';
import { Identifier } from '../../identifier.js';
import { PacketType } from '../../network/packet/packet.js';
import { Serializer } from '../../serializer.js';
import { EndpointType } from '../endpoint/endpoint.js';
import { ExtensionType } from '../extension.js';

import { PermissionType } from './permission.js';

export const PERMISSION_EXTENSION_TYPE = new ExtensionType('permission', (client) => new PermissionExtension(client));
const PERMISSION_REGISTER_PACKET = PacketType.createJson(PERMISSION_EXTENSION_TYPE, {
    name: 'register',
    serializer: Serializer.model(PermissionType).array(),
});
const PERMISSION_REQUEST_ENDPOINT = EndpointType.createJson(PERMISSION_EXTENSION_TYPE, {
    name: 'request',
    requestSerializer: Serializer.model(Identifier).array(),
});
const PERMISSION_GRANT_PACKET = PacketType.createJson(PERMISSION_EXTENSION_TYPE, {
    name: 'grant',
    serializer: Serializer.model(PermissionType).array(),
});

export class PermissionExtension {
    private permissions: Map<string, PermissionType>;
    private readonly registeredPermissions: Map<string, PermissionType>;
    private readonly requiredPermissions: Map<string, Identifier>;

    constructor(private readonly client: Client) {
        this.permissions = new Map();
        this.registeredPermissions = new Map();
        this.requiredPermissions = new Map();
        client.network.registerPacket(
            PERMISSION_REGISTER_PACKET,
            PERMISSION_GRANT_PACKET,
        );
        client.network.addPacketHandler(PERMISSION_GRANT_PACKET, (permissions) => {
            for (const permission of permissions) {
                this.permissions.set(permission.identifier.key(), permission);
            }
        });
        client.network.listeners.connected.subscribe(() => this.handleConnected());
    }

    private handleConnected(): void {
        if (this.registeredPermissions.size === 0) {
            return;
        }
        this.client.send(PERMISSION_REGISTER_PACKET, Array.from(this.registeredPermissions.values()));
        this.client.endpoints.call(PERMISSION_REQUEST_ENDPOINT, Array.from(this.requiredPermissions.values()));
    }

    public register(permission: PermissionType): void {
        this.registeredPermissions.set(permission.identifier.key(), permission);
    }

    public require(permission: PermissionType): void {
        this.requiredPermissions.set(permission.identifier.key(), permission.identifier);
    }

    public has(permissionIdentifier: Identifier): boolean {
        return this.permissions.has(permissionIdentifier.key());
    }
}
