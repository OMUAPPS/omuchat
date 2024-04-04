import { App } from '../../app.js';
import type { Client } from '../../client/index.js';
import { EndpointType } from '../endpoint/endpoint.js';
import type { Extension } from '../extension.js';
import { ExtensionType } from '../extension.js';
import type { Table } from '../table/index.js';
import { TABLE_EXTENSION_TYPE } from '../table/table-extension.js';
import { TableType } from '../table/table.js';

export const SERVER_EXTENSION_TYPE: ExtensionType<ServerExtension> = new ExtensionType(
    'server',
    (client: Client) => new ServerExtension(client),
    () => [TABLE_EXTENSION_TYPE],
);

const APP_TABLE = TableType.model(SERVER_EXTENSION_TYPE, {
    name: 'apps',
    model: App,
});
const SHUTDOWN_ENDPOINT = EndpointType.createJson<boolean, boolean>(SERVER_EXTENSION_TYPE, {
    name: 'shutdown',
});

export class ServerExtension implements Extension {
    apps: Table<App>;

    constructor(private readonly client: Client) {
        const listExtension = client.extensions.get(TABLE_EXTENSION_TYPE);
        this.apps = listExtension.get(APP_TABLE);
    }

    shutdown(restart?: boolean): Promise<boolean> {
        return this.client.endpoints.call(SHUTDOWN_ENDPOINT, restart ?? false);
    }
}
