<script lang="ts">
    import { App, Omu } from '@omujs/omu';
    import { Identifier } from '@omujs/omu/identifier.js';
    import { client } from '../stores.js';

    const load = () => {
        const app = new App(new Identifier('com.omuapps', 'test'), {
            version: '1.0.0',
        });
        client.set(new Omu(app));
        return new Promise<void>((resolve) => $client.whenReady(resolve));
    };
</script>

{#await load() then}
    <slot />
{/await}
