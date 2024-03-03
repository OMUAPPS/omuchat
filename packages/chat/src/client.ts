import * as omu from '@omuchatjs/omu';
import type { TokenProvider } from '@omuchatjs/omu/client/token.js';
import type { Address } from '@omuchatjs/omu/network/index.js';

import type { EventHandler, EventKey } from './event/index.js';
import { EventRegistry } from './event/index.js';
import { Table } from '@omuchatjs/omu/extension/table/table.js';
import * as models from './models/index.js';
import * as chat from './chat.js';

export class Client {
    readonly app: omu.App;
    readonly address: Address;
    readonly omu: omu.Client;
    readonly eventRegistry: EventRegistry;

    readonly messages: Table<models.Message>;
    readonly authors: Table<models.Author>;
    readonly channels: Table<models.Channel>;
    readonly providers: Table<models.Provider>;
    readonly rooms: Table<models.Room>;

    constructor({
        app,
        address,
        client,
        token,
    }: {
        app: omu.App;
        address?: Address;
        client?: omu.Client;
        token?: TokenProvider;
    }) {
        this.app = app;
        this.address = address || {
            host: '127.0.0.1',
            port: 26423,
            secure: false,
        };
        this.omu = client || new omu.OmuClient({
            app,
            address: this.address,
            token: token ?? new BrowserTokenProvider('omu-token'),
        });
        this.eventRegistry = new EventRegistry(this);
        this.messages = this.omu.tables.get(chat.MessagesTableKey);
        this.authors = this.omu.tables.get(chat.AuthorsTableKey);
        this.channels = this.omu.tables.get(chat.ChannelsTableKey);
        this.providers = this.omu.tables.get(chat.ProvidersTableKey);
        this.rooms = this.omu.tables.get(chat.RoomsTableKey);
    }

    async createChannelTree(url: string): Promise<models.Channel[]> {
        return await this.omu.endpoints.call(chat.CreateChannelTree, url);
    }

    run(): void {
        this.omu.start();
    }

    on<T extends unknown[]>(event: EventKey<T>, handler: EventHandler<T>): void {
        this.eventRegistry.on(event, handler);
    }
}

export class BrowserTokenProvider implements TokenProvider {
    constructor(private readonly key: string) { }
    async set(serverAddress: Address, app: omu.App, token: string): Promise<void> {
        const tokens = JSON.parse(localStorage.getItem(this.key) || '{}');
        const key = `${serverAddress.host}:${serverAddress.port}:${app.key()}`;
        tokens[key] = token;
        localStorage.setItem(this.key, JSON.stringify(tokens));
    }

    async get(serverAddress: Address, app: omu.App): Promise<string | null> {
        const tokens = JSON.parse(localStorage.getItem(this.key) || '{}');
        const key = `${serverAddress.host}:${serverAddress.port}:${app.key()}`;
        return Promise.resolve(tokens[key] || null);
    }
}
