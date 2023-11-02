<script>
	import Window from '$lib/Window.svelte';
	import MainWindow from '$lib/main/MainWindow.svelte';
</script>

<svelte:head>
	<title>Editor</title>
	<meta name="description" content="Svelte demo app" />
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.36.0/tabler-icons.min.css"
	/>
</svelte:head>

<main>
	<Window><MainWindow /></Window>
</main>
