import { type Client } from '../client/index.js';
import { Identifier } from '../identifier.js';

export interface Extension { }

export class ExtensionType<T extends Extension = Extension> extends Identifier {
    constructor(
        public readonly name: string,
        public readonly create: (client: Client) => T,
        public readonly dependencies?: () => ExtensionType[],
    ) {
        super('ext', name);
    }

    public key(): string {
        return this.name;
    }
}
