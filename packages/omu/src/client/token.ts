import type { App } from '../index.js';
import type { Address } from '../network/address.js';

export interface TokenProvider {
    get(serverAddress: Address, app: App): Promise<string | undefined>;
    set(serverAddress: Address, app: App, token: string): Promise<void>;
}
