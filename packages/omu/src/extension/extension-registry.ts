import type { Client } from '../client/index.js';

import type { Extension, ExtensionType } from './extension.js';

export interface ExtensionRegistry {
    register<T extends Extension>(type: ExtensionType<T>): T;
    registerAll(types: ExtensionType[]): void;
    get<T extends Extension>(type: ExtensionType<T>): T;
    has<T extends Extension>(type: ExtensionType<T>): boolean;
}

export function createExtensionRegistry(client: Client): ExtensionRegistry {
    const extensionMap: Map<string, Extension> = new Map();

    function register<T extends Extension>(type: ExtensionType<T>): T {
        if (has(type)) {
            throw new Error(`Extension type ${type.name} already registered`);
        }
        type.dependencies?.().forEach((dependency) => {
            if (!has(dependency)) {
                throw new Error(
                    `Extension type ${type.name} depends on ${dependency.name} which is not registered`,
                );
            }
        });
        const extension = type.create(client);
        extensionMap.set(type.name, extension);
        return extension;
    }

    function registerAll(types: ExtensionType[]): void {
        types.forEach((type) => register(type));
    }

    function get<Ext extends Extension>(extensionType: ExtensionType<Ext>): Ext {
        const extension = extensionMap.get(extensionType.name);
        if (!extension) {
            throw new Error(`Extension type ${extensionType.name} not registered`);
        }
        return extension as Ext;
    }

    function has<T extends Extension>(extensionType: ExtensionType<T>): boolean {
        return extensionMap.has(extensionType.name);
    }

    return {
        register,
        registerAll: registerAll,
        get,
        has,
    };
}
