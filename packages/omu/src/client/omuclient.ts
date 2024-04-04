import type { AssetExtension } from '../extension/asset/asset-extension.js';
import { AssetExtensionType as ASSET_EXTENSION_TYPE } from '../extension/asset/asset-extension.js';
import { DASHBOARD_EXTENSION_TYPE, type DashboardExtension } from '../extension/dashboard/dashboard-extension.js';
import type { EndpointExtension } from '../extension/endpoint/endpoint-extension.js';
import { EndpointExtensionType as ENDPOINT_EXTENSION_TYPE } from '../extension/endpoint/endpoint-extension.js';
import { ExtensionManager } from '../extension/extension-manager.js';
import type { MessageExtension } from '../extension/message/message-extension.js';
import { MessageExtensionType as MESSAGE_EXTENSION_TYPE } from '../extension/message/message-extension.js';
import { PERMISSION_EXTENSION_TYPE, type PermissionExtension } from '../extension/permission/permission-extension.js';
import type { PluginExtension } from '../extension/plugin/plugin-extension.js';
import { PLUGIN_EXTENSION_TYPE } from '../extension/plugin/plugin-extension.js';
import type { RegistryExtension } from '../extension/registry/registry-extension.js';
import { RegistryExtensionType as REGISTRY_EXTENSION_TYPE } from '../extension/registry/registry-extension.js';
import type { App, ServerExtension } from '../extension/server/index.js';
import { SERVER_EXTENSION_TYPE } from '../extension/server/index.js';
import type { TableExtension } from '../extension/table/table-extension.js';
import { TABLE_EXTENSION_TYPE } from '../extension/table/table-extension.js';
import type { Address, Connection } from '../network/index.js';
import { Network } from '../network/index.js';
import type { PacketType } from '../network/packet/packet.js';
import { WebsocketConnection } from '../network/websocket-connection.js';

import type { Client } from './client.js';
import { ClientListeners } from './client.js';
import type { TokenProvider } from './token.js';

export class OmuClient implements Client {
    public running: boolean;
    readonly listeners: ClientListeners;
    readonly app: App;
    readonly token: TokenProvider;
    readonly address: Address;
    readonly network: Network;
    readonly endpoints: EndpointExtension;
    readonly permissions: PermissionExtension;
    readonly plugins: PluginExtension;
    readonly dashboard: DashboardExtension;
    readonly extensions: ExtensionManager;
    readonly tables: TableExtension;
    readonly registry: RegistryExtension;
    readonly message: MessageExtension;
    readonly assets: AssetExtension;
    readonly server: ServerExtension;

    constructor(options: {
        app: App;
        token: TokenProvider;
        address: Address;
        connection?: Connection;
    }) {
        this.running = false;
        this.listeners = new ClientListeners();
        this.app = options.app;
        this.token = options.token;
        this.address = options.address;
        this.network = new Network(this, options.address, this.token, options.connection ?? new WebsocketConnection(options.address));
        this.extensions = new ExtensionManager(this);

        this.endpoints = this.extensions.register(ENDPOINT_EXTENSION_TYPE);
        this.permissions = this.extensions.register(PERMISSION_EXTENSION_TYPE);
        this.plugins = this.extensions.register(PLUGIN_EXTENSION_TYPE);
        this.dashboard = this.extensions.register(DASHBOARD_EXTENSION_TYPE);
        this.tables = this.extensions.register(TABLE_EXTENSION_TYPE);
        this.registry = this.extensions.register(REGISTRY_EXTENSION_TYPE);
        this.message = this.extensions.register(MESSAGE_EXTENSION_TYPE);
        this.assets = this.extensions.register(ASSET_EXTENSION_TYPE);
        this.server = this.extensions.register(SERVER_EXTENSION_TYPE);
        this.listeners.initialized.emit();
    }

    send<T>(packetType: PacketType<T>, data: T): void {
        this.network.send({
            type: packetType,
            data,
        });
    }

    start(): void {
        if (this.running) {
            throw new Error('Client already running');
        }
        this.running = true;
        this.network.connect();
        this.listeners.started.emit();
    }

    stop(): void {
        this.running = false;
        this.listeners.stopped.emit();
    }
}
