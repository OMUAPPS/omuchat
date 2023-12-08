<script lang="ts">
    import { onMount } from 'svelte';

    import { theme } from '$lib/common/theme';
    import MainWindow from '$lib/main/MainWindow.svelte';
    import Window from '$lib/Window.svelte';

    let styleDiv: HTMLElement;

    onMount(() => {
        theme.subscribe((theme) => {
            styleDiv.innerHTML = '';
            const style = document.createElement('style');
            styleDiv.appendChild(style);
            const css = Object.entries(theme).map(([key, value]) => `${key}: ${value};`).join('\n');
            console.log(css);
            style.innerHTML = `
                :root {
                    ${css}
                }
            `;
        });
    });
</script>

<svelte:head>
    <title>Editor</title>
    <meta name="description" content="Svelte demo app" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="crossorigin">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="icons-webfont/tabler-icons.css">

</svelte:head>

<main>
    <div bind:this={styleDiv}></div>
    <Window><MainWindow /></Window>
</main>
