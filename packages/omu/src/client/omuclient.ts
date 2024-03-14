import type { AssetExtension } from '../extension/asset/asset-extension.js';
import { AssetExtensionType } from '../extension/asset/asset-extension.js';
import type { EndpointExtension } from '../extension/endpoint/endpoint-extension.js';
import { EndpointExtensionType } from '../extension/endpoint/endpoint-extension.js';
import { ExtensionManager } from '../extension/extension-manager.js';
import type { MessageExtension } from '../extension/message/message-extension.js';
import { MessageExtensionType } from '../extension/message/message-extension.js';
import type { RegistryExtension } from '../extension/registry/registry-extension.js';
import { RegistryExtensionType } from '../extension/registry/registry-extension.js';
import type { App, ServerExtension } from '../extension/server/index.js';
import { ServerExtensionType } from '../extension/server/index.js';
import type { TableExtension } from '../extension/table/table-extension.js';
import { TableExtensionType } from '../extension/table/table-extension.js';
import { Address, Connection, Network } from '../network/index.js';
import { WebsocketConnection } from '../network/websocket-connection.js';

import { PacketType } from '../network/packet/packet.js';
import { Client, ClientListeners } from './client.js';
import type { TokenProvider } from './token.js';

export class OmuClient implements Client {
    public running: boolean;
    readonly listeners: ClientListeners;
    readonly app: App;
    readonly token: TokenProvider;
    readonly network: Network;
    readonly extensions: ExtensionManager;
    readonly endpoints: EndpointExtension;
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
        this.network = new Network(this, options.address, this.token, options.connection ?? new WebsocketConnection(options.address));
        this.extensions = new ExtensionManager(this);

        this.tables = this.extensions.register(TableExtensionType);
        this.endpoints = this.extensions.register(EndpointExtensionType);
        this.server = this.extensions.register(ServerExtensionType);
        this.registry = this.extensions.register(RegistryExtensionType);
        this.message = this.extensions.register(MessageExtensionType);
        this.assets = this.extensions.register(AssetExtensionType);
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
        this.listeners.started.emit();
    }

    stop(): void {
        this.running = false;
        this.listeners.stopped.emit();
    }
}
