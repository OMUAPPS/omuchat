import type { Address, Connection } from '../connection/index.js';
import type { EventRegistry, EventType } from '../event/index.js';
import type { AssetExtension } from '../extension/asset/asset-extension.js';
import type { EndpointExtension } from '../extension/endpoint/index.js';
import type { ExtensionRegistry } from '../extension/extension-registry.js';
import type { MessageExtension } from '../extension/message/message-extension.js';
import type { RegistryExtension } from '../extension/registry/registry-extension.js';
import type { App, ServerExtension } from '../extension/server/index.js';
import type { TableExtension } from '../extension/table/table-extension.js';

import type { TokenProvider } from './token.js';

export interface ClientListener {
    onInitialized?(): void;
    onStarted?(): void;
    onStopped?(): void;
    onReady?(): void;
}

export interface Client {
    readonly app: App;
    readonly token: TokenProvider;
    readonly address: Address;
    readonly connection: Connection;
    readonly events: EventRegistry;
    readonly extensions: ExtensionRegistry;
    readonly endpoints: EndpointExtension;
    readonly tables: TableExtension;
    readonly registry: RegistryExtension;
    readonly message: MessageExtension;
    readonly assets: AssetExtension;
    readonly server: ServerExtension;
    readonly running: boolean;

    start(): void;
    stop(): void;
    send<T, D>(type: EventType<T, D>, data: T): void;
    proxy(url: string): string;
    asset(url: string): string;

    addListener(listener: ClientListener): void;
    removeListener(listener: ClientListener): void;
}
