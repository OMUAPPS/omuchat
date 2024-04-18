import type { Client } from '../../client/index.js';
import { Identifier, IdentifierMap, IdentifierSet } from '../../identifier.js';
import { PacketType } from '../../network/packet/packet.js';
import { Serializer } from '../../serializer.js';
import { EndpointType } from '../endpoint/endpoint.js';
import { ExtensionType } from '../extension.js';

import { PermissionType } from './permission.js';

export const PERMISSION_EXTENSION_TYPE = new ExtensionType('permission', (client) => new PermissionExtension(client));
const PERMISSION_REGISTER_PACKET = PacketType.createJson<PermissionType[]>(PERMISSION_EXTENSION_TYPE, {
    name: 'register',
    serializer: Serializer.model(PermissionType).toArray(),
});
const PERMISSION_REQUEST_ENDPOINT = EndpointType.createJson<Identifier[], void>(PERMISSION_EXTENSION_TYPE, {
    name: 'request',
    requestSerializer: Serializer.model(Identifier).toArray(),
});
const PERMISSION_GRANT_PACKET = PacketType.createJson<PermissionType[]>(PERMISSION_EXTENSION_TYPE, {
    name: 'grant',
    serializer: Serializer.model(PermissionType).toArray(),
});

export class PermissionExtension {
    private permissions = new IdentifierMap<PermissionType>();
    private readonly registeredPermissions = new IdentifierMap<PermissionType>();
    private readonly requiredPermissions = new IdentifierSet();

    constructor(private readonly client: Client) {
        client.network.registerPacket(
            PERMISSION_REGISTER_PACKET,
            PERMISSION_GRANT_PACKET,
        );
        client.network.addPacketHandler(PERMISSION_GRANT_PACKET, (permissions) => {
            for (const permission of permissions) {
                this.permissions.set(permission.identifier, permission);
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
        this.registeredPermissions.set(permission.identifier, permission);
    }

    public require(permission: PermissionType): void {
        this.requiredPermissions.add(permission.identifier);
    }

    public has(permissionIdentifier: Identifier): boolean {
        return this.permissions.has(permissionIdentifier);
    }
}
