<script>
    import MainWindow from '$lib/main/MainWindow.svelte';
    import Window from '$lib/Window.svelte';
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
    <Window><MainWindow /></Window>
</main>
