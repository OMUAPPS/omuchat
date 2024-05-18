<script lang="ts">
    import { Identifier } from '@omuchatjs/omu/identifier.js';
    import { client } from '../stores.js';
    import { App, Client } from '@omuchatjs/omu';

    const load = () => {
        const app = new App(new Identifier('cc.omuchat', 'test'), {
            version: '1.0.0',
        });
        client.set(new Client(app));
        return new Promise<void>((resolve) => $client.whenReady(resolve));
    };
</script>

{#await load()}
    <slot />
{:then}
    <slot />
{/await}
