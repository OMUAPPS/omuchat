import type { Keyable } from './interface.js';

const NAMESPACE_REGEX = /^\w+(\.[:\w]+)*$/;
const NAME_REGEX = /^[\w-]+$/;


export class Identifier implements Keyable {
    constructor(public namespace: string, public name: string) {
        Identifier.validate(namespace, name);
    }

    static validate(namespace: string, name: string) {
        if (!namespace) {
            throw new Error('Invalid namespace');
        }
        if (!name) {
            throw new Error('Invalid name');
        }
        if (!NAMESPACE_REGEX.test(namespace)) {
            throw new Error(`Invalid namespace ${namespace}`);
        }
        if (!NAME_REGEX.test(name)) {
            throw new Error(`Invalid name ${name}`);
        }
    }

    static format(namespace: string, name: string): string {
        Identifier.validate(namespace, name);
        return `${namespace}:${name}`;
    }

    static create(namespace: string, name: string): Identifier {
        Identifier.validate(namespace, name);
        return new Identifier(namespace, name);
    }

    static fromKey(key: string): Identifier {
        const separator = key.lastIndexOf(':');
        if (separator === -1) {
            throw new Error(`Invalid key ${key}`);
        }
        const namespace = key.substring(0, separator);
        const name = key.substring(separator + 1);
        Identifier.validate(namespace, name);
        return new Identifier(namespace, name);
    }

    public key(): string {
        return `${this.namespace}:${this.name}`;
    }
}
