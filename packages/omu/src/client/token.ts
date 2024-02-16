import { Address } from '../connection/address.js';
import type { App } from '../index.js';

export interface TokenProvider {
    get(serverAddress: Address, app: App): Promise<string | null>;
    set(serverAddress: Address, app: App, token: string): Promise<void>;
}
