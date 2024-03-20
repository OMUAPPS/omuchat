import * as omu from '@omuchatjs/omu';
import type { TokenProvider } from '@omuchatjs/omu/client/token.js';
import type { Address } from '@omuchatjs/omu/network/index.js';

import { Chat } from './chat.js';
import type { EventHandler, EventKey } from './event/index.js';
import { EventRegistry } from './event/index.js';

export class Client extends omu.OmuClient {
    private readonly eventRegistry: EventRegistry;
    public readonly chat: Chat;

    constructor({
        app,
        address,
        token,
    }: {
        app: omu.App;
        address?: Address;
        client?: omu.Client;
        token?: TokenProvider;
    }) {
        super({
            app,
            address: address || {
                host: '127.0.0.1',
                port: 26423,
                secure: false,
            },
            token: token ?? new BrowserTokenProvider('omu-token'),
        });
        this.eventRegistry = new EventRegistry(this);
        this.chat = new Chat(this);
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

    async get(serverAddress: Address, app: omu.App): Promise<string | undefined> {
        const tokens = JSON.parse(localStorage.getItem(this.key) || '{}');
        const key = `${serverAddress.host}:${serverAddress.port}:${app.key()}`;
        return Promise.resolve(tokens[key] || null);
    }
}
