import type { App } from '../index.js';

export interface TokenProvider {
    get(app: App): Promise<string | null>;
    set(app: App, token: string): Promise<void>;
}
