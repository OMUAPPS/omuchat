<script lang="ts">
    import { App, Omu } from '@omuchatjs/omu';
    import { Identifier } from '@omuchatjs/omu/identifier.js';
    import { client } from '../stores.js';

    const load = () => {
        const app = new App(new Identifier('cc.omuchat', 'test'), {
            version: '1.0.0',
        });
        client.set(new Omu(app));
        return new Promise<void>((resolve) => $client.whenReady(resolve));
    };
</script>

{#await load()}
    <slot />
{:then}
    <slot />
{/await}
