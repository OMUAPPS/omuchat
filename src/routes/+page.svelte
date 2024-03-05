<script lang="ts">
    import { App } from '@omuchatjs/omu';

    import MainWindow from '$lib/main/MainWindow.svelte';
    import Window from '$lib/Window.svelte';

    const app = new App({
        name: 'dashboard',
        version: '0.1.0',
        group: 'omu.chat',
    });
</script>

<main>
    <Window {app}><MainWindow /></Window>
</main>
