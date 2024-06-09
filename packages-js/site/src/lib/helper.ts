import type { Registry } from '@omujs/omu/extension/registry/index.js';
import { type Writable } from 'svelte/store';

export function makeRegistryWritable<T>(registry: Registry<T>): Writable<T> {
    return {
        set: (value: T) => {
            registry.set(value);
        },
        subscribe: (run) => {
            const unlisten = registry.listen(run);
            run(registry.value);
            return unlisten;
        },
        update: (fn) => {
            registry.update(fn);
        },
    };
}
