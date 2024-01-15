import { type Client } from '../client/index.js';

export interface Extension {
}

export interface ExtensionType<T extends Extension = Extension> {
    readonly key: string;
    create: (client: Client) => T;
    dependencies?: () => ExtensionType[];
}

export function defineExtensionType<T extends Extension>(key: string, {
    create,
    dependencies,
}: {
    create: (client: Client) => T;
    dependencies?: () => ExtensionType[];
}): ExtensionType<T> {
    return {
        key,
        create,
        dependencies,
    };
}
