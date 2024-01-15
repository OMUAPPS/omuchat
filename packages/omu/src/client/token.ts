
export interface TokenProvider {
    get(): Promise<string | null>;
    set(token: string): Promise<void>;
}

export class BrowserTokenProvider implements TokenProvider {
    constructor(private readonly key: string) {
    }

    async get(): Promise<string | null> {
        return localStorage.getItem(this.key);
    }

    async set(token: string): Promise<void> {
        localStorage.setItem(this.key, token);
    }
}
