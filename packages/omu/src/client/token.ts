import type { Address } from '../address.js';
import type { App } from '../index.js';

export interface TokenProvider {
    get(serverAddress: Address, app: App): Promise<string | undefined>;
    set(serverAddress: Address, app: App, token: string): Promise<void>;
}
