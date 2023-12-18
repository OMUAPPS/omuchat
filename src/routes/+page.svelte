<script lang="ts">
    import { App } from '@omuchat/omu.js';
    
    import MainWindow from '$lib/main/MainWindow.svelte';
    import Window from '$lib/Window.svelte';

    const app = new App({
        name: "omu-client",
        version: "0.1.0",
        group: "omu",
    });
</script>

<main>
    <Window {app}><MainWindow /></Window>
</main>
