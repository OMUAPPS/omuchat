import type { Omu } from '@omujs/omu';
import type { RegistryType } from '@omujs/omu/extension/registry/index.js';
import { writable, type Writable } from 'svelte/store';

export function createRegistryStore<T>(omu: Omu, registryType: RegistryType<T>): Writable<T> {
    const store = writable(registryType.defaultValue);
    const registry = omu.registry.get(registryType);

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
