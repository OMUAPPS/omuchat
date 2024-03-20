<script lang="ts">
    import { App } from '@omuchatjs/omu';

    import MainWindow from '$lib/main/MainWindow.svelte';
    import Window from '$lib/Window.svelte';
    import { Identifier } from '@omuchatjs/omu/identifier.js';

    const IDENTIFIER = new Identifier('cc.omuchat', 'dashboard');
    const app = new App(IDENTIFIER, {
        version: '0.1.0',
    });
</script>

<main>
    <Window {app}><MainWindow /></Window>
</main>
