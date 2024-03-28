import type { Keyable } from './interface.js';

const NAMESPACE_REGEX = /^(\.[^/:.]|[\w-])+$/;
const NAME_REGEX = /^[^/:.]+$/;

export class Identifier implements Keyable {
    public readonly namespace: string;
    public readonly path: string[];

    constructor(
        namespace: string,
        ...path: string[]
    ) {
        Identifier.validate(namespace, path);
        this.namespace = namespace;
        this.path = path;
    }

    static validate(namespace: string, path: string[]): void {
        if (!namespace) {
            throw new Error('Invalid namespace: Namespace cannot be empty');
        }
        if (path.length === 0) {
            throw new Error('Invalid path: Path must have at least one name');
        }
        if (!NAMESPACE_REGEX.test(namespace)) {
            throw new Error(`Invalid namespace: Namespace must match ${NAMESPACE_REGEX}`);
        }
        for (const name of path) {
            if (!NAME_REGEX.test(name)) {
                throw new Error(`Invalid path: Name must match ${NAME_REGEX}`);
            }
        }
    }

    static format(namespace: string, ...path: string[]): string {
        Identifier.validate(namespace, path);
        return `${namespace}:${path.join('/')}`;
    }

    static fromKey(key: string): Identifier {
        const separator = key.indexOf(':');
        if (separator === -1) {
            throw new Error(`Invalid key: No separator found in ${key}`);
        }
        if (key.indexOf(':', separator + 1) !== -1) {
            throw new Error(`Invalid key: Multiple separators found in ${key}`);
        }
        const namespace = key.slice(0, separator);
        const path = key.slice(separator + 1);
        if (!namespace || !path) {
            throw new Error('Invalid key: Namespace and path cannot be empty');
        }
        return new Identifier(namespace, ...path.split('/'));
    }

    static fromUrl(url: string | URL): Identifier {
        let parsedUrl: URL;
        if (typeof url === 'string') {
            parsedUrl = new URL(url);
        } else {
            parsedUrl = url;
        }
        const namespace = parsedUrl.hostname.split('.').reverse().join('.');
        const path = parsedUrl.pathname.slice(1).split('/');
        return new Identifier(namespace, ...path);
    }

    public key(): string {
        return Identifier.format(this.namespace, ...this.path);
    }

    public join(...path: string[]): Identifier {
        return new Identifier(this.namespace, ...this.path, ...path);
    }
}
