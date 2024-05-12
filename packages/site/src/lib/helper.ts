import type { Client } from '@omuchatjs/omu';
import type { RegistryType } from '@omuchatjs/omu/extension/registry/index.js';
import { writable, type Writable } from 'svelte/store';

export function createRegistryStore<T>(client: Client, registryType: RegistryType<T>): Writable<T> {
    const store = writable(registryType.defaultValue);
    const registry = client.registry.get(registryType);

    let lastValue: T = registryType.defaultValue;
    store.subscribe((value) => {
        if (value === lastValue) {
            return;
        }
        lastValue = value;
        registry.set(value);
    });
    registry.listen((value) => {
        if (value === lastValue) {
            return;
        }
        lastValue = value;
        store.set(value);
    });

    return store;
}
