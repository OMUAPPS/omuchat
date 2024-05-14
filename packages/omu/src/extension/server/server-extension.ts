import { App } from '../../app.js';
import type { Client } from '../../client/index.js';
import { Identifier, IdentifierSet } from '../../identifier.js';
import { PacketType } from '../../network/packet/packet.js';
import { Serializer } from '../../serializer.js';
import { EndpointType } from '../endpoint/endpoint.js';
import type { Extension } from '../extension.js';
import { ExtensionType } from '../extension.js';
import { RegistryType } from '../registry/registry.js';
import type { Table } from '../table/index.js';
import { TABLE_EXTENSION_TYPE } from '../table/table-extension.js';
import { TableType } from '../table/table.js';

import { ConsolePacket } from './packets.js';

export const SERVER_EXTENSION_TYPE: ExtensionType<ServerExtension> = new ExtensionType(
    'server',
    (client: Client) => new ServerExtension(client),
    () => [TABLE_EXTENSION_TYPE],
);

export const SERVER_APPS_READ_PERMISSION_ID = SERVER_EXTENSION_TYPE.join('apps', 'read');
const APP_TABLE_TYPE = TableType.createModel(SERVER_EXTENSION_TYPE, {
    name: 'apps',
    model: App,
    permissions: {
        read: SERVER_APPS_READ_PERMISSION_ID,
    },
});
export const SERVER_SHUTDOWN_PERMISSION_ID = SERVER_EXTENSION_TYPE.join('shutdown');
const SHUTDOWN_ENDPOINT_TYPE = EndpointType.createJson<boolean, boolean>(SERVER_EXTENSION_TYPE, {
    name: 'shutdown',
    permissionId: SERVER_SHUTDOWN_PERMISSION_ID,
});
const REQUIRE_APPS_PACKET_TYPE = PacketType.createJson<Identifier[]>(SERVER_EXTENSION_TYPE, {
    name: 'require_apps',
    serializer: Serializer.model(Identifier).toArray(),
});
const VERSION_REGISTRY_TYPE = RegistryType.createJson<string | null>(SERVER_EXTENSION_TYPE, {
    name: 'version',
    defaultValue: null,
});
export const SERVER_CONSOLE_PERMISSION_ID = SERVER_EXTENSION_TYPE.join('console');
const CONSOLE_GET_ENDPOINT_TYPE = EndpointType.createJson<number | null, string[]>(
    SERVER_EXTENSION_TYPE,
    {
        name: 'console',
        permissionId: SERVER_CONSOLE_PERMISSION_ID,
    },
);
const CONSOLE_LISTEN_PACKET_TYPE = PacketType.createJson<null>(SERVER_EXTENSION_TYPE, {
    name: 'console_listen',
});
const CONSOLE_PACKET_TYPE = PacketType.createSerialized<ConsolePacket>(SERVER_EXTENSION_TYPE, {
    name: 'console',
    serializer: ConsolePacket,
});

export class ServerExtension implements Extension {
    public readonly apps: Table<App>;
    private requiredApps = new IdentifierSet();
    private consoleListeners: ((lines: string[]) => void)[] = [];

    constructor(private readonly client: Client) {
        client.network.registerPacket(REQUIRE_APPS_PACKET_TYPE, CONSOLE_PACKET_TYPE);
        client.network.addPacketHandler(CONSOLE_PACKET_TYPE, (packet) => {
            for (const listener of this.consoleListeners) {
                listener(packet.lines);
            }
        });
        this.apps = client.tables.get(APP_TABLE_TYPE);
        client.network.addTask(() => this.onTask());
    }

    private async onTask(): Promise<void> {
        this.client.send(REQUIRE_APPS_PACKET_TYPE, Array.from(this.requiredApps.values()));
    }

    public async shutdown(restart?: boolean): Promise<boolean> {
        return await this.client.endpoints.call(SHUTDOWN_ENDPOINT_TYPE, restart ?? false);
    }

    public require(...appIds: Identifier[]): void {
        if (this.client.running) {
            throw new Error('Cannot require apps after the client has started');
        }
        for (const appId of appIds) {
            this.requiredApps.add(appId);
        }
    }

    public getConsole(lineCount: number | null): Promise<string[]> {
        return this.client.endpoints.call(CONSOLE_GET_ENDPOINT_TYPE, lineCount);
    }

    public listenConsole(listener: (lines: string[]) => void): void {
        if (this.consoleListeners.length === 0) {
            this.client.whenReady(() => {
                this.client.send(CONSOLE_LISTEN_PACKET_TYPE, null);
            });
        }
        this.consoleListeners.push(listener);
    }
}
