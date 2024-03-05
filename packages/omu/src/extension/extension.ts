import { type Client } from '../client/index.js';

export interface Extension {}

export class ExtensionType<T extends Extension = Extension> {
    constructor(
        public readonly name: string,
        public readonly create: (client: Client) => T,
        public readonly dependencies?: () => ExtensionType[],
    ) {}

    public key(): string {
        return this.name;
    }
}
