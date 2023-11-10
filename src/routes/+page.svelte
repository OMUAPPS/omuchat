<script>
	import Window from '$lib/Window.svelte';
	import MainWindow from '$lib/main/MainWindow.svelte';
</script>

<svelte:head>
	<title>Editor</title>
	<meta name="description" content="Svelte demo app" />
	<link rel="stylesheet" href="/@tabler/icons-webfont/tabler-icons.css" />
</svelte:head>

<main>
	<Window><MainWindow /></Window>
</main>
