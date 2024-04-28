import { App } from '../../app.js';
import type { Client } from '../../client/index.js';
import { Identifier, IdentifierSet } from '../../identifier.js';
import { Serializer } from '../../serializer.js';
import { EndpointType } from '../endpoint/endpoint.js';
import type { Extension } from '../extension.js';
import { ExtensionType } from '../extension.js';
import { RegistryType } from '../registry/registry.js';
import type { Table } from '../table/index.js';
import { TABLE_EXTENSION_TYPE } from '../table/table-extension.js';
import { TableType } from '../table/table.js';

export const SERVER_EXTENSION_TYPE: ExtensionType<ServerExtension> = new ExtensionType(
    'server',
    (client: Client) => new ServerExtension(client),
    () => [TABLE_EXTENSION_TYPE],
);

const APP_TABLE_TYPE = TableType.model(SERVER_EXTENSION_TYPE, {
    name: 'apps',
    model: App,
});
const SHUTDOWN_ENDPOINT_TYPE = EndpointType.createJson<boolean, boolean>(SERVER_EXTENSION_TYPE, {
    name: 'shutdown',
});
const REQUIRE_APPS_ENDPOINT_TYPE = EndpointType.createJson<Identifier[], void>(SERVER_EXTENSION_TYPE, {
    name: 'require_apps',
    requestSerializer: Serializer.model(Identifier).toArray(),
});
const VERSION_REGISTRY_TYPE = RegistryType.createJson<string | null>(SERVER_EXTENSION_TYPE, {
    name: 'version',
    defaultValue: null,
});

export class ServerExtension implements Extension {
    public readonly apps: Table<App>;
    private requiredApps = new IdentifierSet();

    constructor(private readonly client: Client) {
        this.apps = client.tables.get(APP_TABLE_TYPE);
        client.network.listeners.connected.subscribe(() => this.onConnected());
    }

    private async onConnected(): Promise<void> {
        await this.client.endpoints.call(REQUIRE_APPS_ENDPOINT_TYPE, Array.from(this.requiredApps.values()));
    }

    public async shutdown(restart?: boolean): Promise<boolean> {
        return await this.client.endpoints.call(SHUTDOWN_ENDPOINT_TYPE, restart ?? false);
    }

    public require(...appIds: Identifier[]): void {
        for (const appId of appIds) {
            this.requiredApps.add(appId);
        }
    }
}
