import type { Keyable } from './interface/keyable.js';

export class Identifier implements Keyable {
    constructor(public namespace: string, public name: string) { }

    static create(namespace: string, name: string): Identifier {
        return new Identifier(namespace, name);
    }

    static fromKey(key: string): Identifier {
        const [namespace, name] = key.split(':');
        if (!namespace || !name) {
            throw new Error(`Invalid key ${key}`);
        }
        return new Identifier(namespace, name);
    }

    key(): string {
        return `${this.namespace}:${this.name}`;
    }
}
