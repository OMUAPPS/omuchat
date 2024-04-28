import type { Client } from '../../index.js';
import { PacketType } from '../../network/packet/packet.js';
import { EndpointType } from '../endpoint/endpoint.js';
import { ExtensionType } from '../extension.js';

export const PLUGIN_EXTENSION_TYPE = new ExtensionType(
    'plugin',
    (client: Client) => new PluginExtension(client),
);

export class PluginExtension {
    private readonly plugins: Map<string, string | null> = new Map();

    constructor(private readonly client: Client) {
        client.network.registerPacket(
            PLUGIN_REQUIRE_PACKET,
        );
        client.network.listeners.connected.subscribe(() => this.handleConnected());
    }

    private async handleConnected(): Promise<void> {
        this.client.send(PLUGIN_REQUIRE_PACKET, Object.fromEntries(this.plugins));
    }

    public require(plugins: Record<string, string | null>): void {
        for (const [key, value] of Object.entries(plugins)) {
            this.plugins.set(key, value);
        }
        this.client.permissions.require(PLUGIN_PERMISSION);
    }
}

const PLUGIN_PERMISSION = PLUGIN_EXTENSION_TYPE.join('request');
const PLUGIN_REQUIRE_PACKET = PacketType.createJson<Record<string, string | null>>(PLUGIN_EXTENSION_TYPE, {
    name: 'require',
});
type WaitResponse = {
    success: boolean;
}
const PLUGIN_WAIT_ENDPOINT = EndpointType.createJson<string[], WaitResponse>(PLUGIN_EXTENSION_TYPE, {
    name: 'wait',
});
