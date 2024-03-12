import type { Client } from '../../client/index.js';
import { EndpointType } from '../endpoint/endpoint.js';
import { Extension, ExtensionType } from '../extension.js';
import type { Table } from '../table/index.js';
import { TableExtensionType } from '../table/table-extension.js';
import { TableType } from '../table/table.js';

import { App } from './app.js';

export const ServerExtensionType: ExtensionType<ServerExtension> = new ExtensionType(
    'server',
    (client: Client) => new ServerExtension(client),
    () => [TableExtensionType],
);

const AppsTableKey = TableType.model(ServerExtensionType, {
    name: 'apps',
    model: App,
});
const ShutdownEndpointType = EndpointType.createJson<boolean, boolean>(ServerExtensionType, {
    name: 'shutdown',
});
const PrintTasksEndpointType = EndpointType.createJson<{}, void>(ServerExtensionType, {
    name: 'shutdown',
});

export class ServerExtension implements Extension {
    apps: Table<App>;

    constructor(private readonly client: Client) {
        const listExtension = client.extensions.get(TableExtensionType);
        this.apps = listExtension.get(AppsTableKey);
    }

    shutdown(restart?: boolean): Promise<boolean> {
        return this.client.endpoints.call(ShutdownEndpointType, restart ?? false);
    }

    printTasks(): Promise<void> {
        return this.client.endpoints.call(PrintTasksEndpointType, {});
    }
}
