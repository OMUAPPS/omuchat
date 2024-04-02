import type { Client } from '../../index.js';
import { PacketType } from '../../network/packet/packet.js';
import { Serializer } from '../../serializer.js';
import { EndpointType } from '../endpoint/endpoint.js';
import { ExtensionType } from '../extension.js';
import { PermissionType } from '../permission/permission.js';

import { PluginType } from './plugin.js';

export const PLUGIN_EXTENSION_TYPE = new ExtensionType(
    'plugin',
    (client: Client) => new PluginExtension(client),
);

export class PluginExtension {
    private readonly plugins: Map<string, PluginType> = new Map();

    constructor(private readonly client: Client) {
        client.network.registerPacket(
            PLUGIN_REGISTER_PACKET,
            PLUGIN_REQUIRE_PACKET,
        );
        client.network.listeners.connected.subscribe(() => this.handleConnected());
    }

    private async handleConnected(): Promise<void> {
        const response = await this.client.endpoints.call(PLUGIN_WAIT_ENDPOINT, Array.from(this.plugins.keys()));
        if (!response.ok) {
            throw new Error('Failed to wait for plugins');
        }
    }
}

const PLUGIN_PERMISSION = PermissionType.create(PLUGIN_EXTENSION_TYPE, {
    name: 'permission',
});
const PLUGIN_REGISTER_PACKET = PacketType.createJson<PluginType[]>(PLUGIN_EXTENSION_TYPE, {
    name: 'register',
    serializer: Serializer.model(PluginType).array(),
});
const PLUGIN_REQUIRE_PACKET = PacketType.createJson<PluginType[]>(PLUGIN_EXTENSION_TYPE, {
    name: 'require',
    serializer: Serializer.model(PluginType).array(),
});
type WaitResponse = {
    ok: boolean;
}
const PLUGIN_WAIT_ENDPOINT = EndpointType.createJson<string[], WaitResponse>(PLUGIN_EXTENSION_TYPE, {
    name: 'wait',
});
