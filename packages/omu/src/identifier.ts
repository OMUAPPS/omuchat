import type { Keyable } from './interface.js';

const NAMESPACE_REGEX = /^(\.[^.]|[\w-])+$/;
const NAME_REGEX = /^[^/.]+$/;

export class Identifier implements Keyable {
    public readonly namespace: string;
    public readonly path: string[];
    public readonly name: string;

    constructor(
        namespace: string,
        ...path: string[]
    ) {
        Identifier.validate(namespace, path);
        this.namespace = namespace;
        this.path = path;
        const name = path.at(-1);
        if (!name) {
            throw new Error('Invalid name');
        }
        this.name = name;
    }

    static validate(namespace: string, path: string[]): void {
        if (!namespace || !path.length) {
            throw new Error('Invalid namespace');
        }
        if (!NAMESPACE_REGEX.test(namespace)) {
            throw new Error(`Invalid namespace ${namespace}`);
        }
        for (const name of path) {
            if (!NAME_REGEX.test(name)) {
                throw new Error(`Invalid name ${name}`);
            }
        }
    }

    static format(namespace: string, ...path: string[]): string {
        Identifier.validate(namespace, path);
        return `${namespace}:${path.join('/')}`;
    }

    static fromKey(key: string): Identifier {
        const separator = key.lastIndexOf(':');
        if (separator === -1) {
            throw new Error(`Invalid key ${key}`);
        }
        const namespace = key.slice(0, separator);
        const path = key.slice(separator + 1);
        if (!namespace || !path) {
            throw new Error(`Invalid key ${key}`);
        }
        return new Identifier(namespace, ...path.split('/'));
    }

    public key(): string {
        return Identifier.format(this.namespace, ...this.path);
    }

    public join(...path: string[]): Identifier {
        return new Identifier(this.namespace, ...this.path, ...path);
    }
}
