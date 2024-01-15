import type { Client } from '../../client/index.js';
import { JsonEndpointType } from '../endpoint/endpoint.js';
import type { Extension, ExtensionType } from '../extension.js';
import { defineExtensionType } from '../extension.js';
import type { Table } from '../table/index.js';
import { TableExtensionType } from '../table/table-extension.js';
import { ModelTableType } from '../table/table.js';

import { App } from './model/index.js';

export const ServerExtensionType: ExtensionType<ServerExtension> = defineExtensionType('server', {
    create: (client: Client) => new ServerExtension(client),
    dependencies: () => [TableExtensionType],
});

const AppsTableKey = ModelTableType.ofExtension(ServerExtensionType, {
    name: 'apps',
    model: App,
});
const ShutdownEndpointType = JsonEndpointType.ofExtension<boolean, boolean>(ServerExtensionType, {
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
}
