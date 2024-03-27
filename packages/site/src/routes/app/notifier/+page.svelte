<script lang="ts">
    import { browser } from '$app/environment';

    let messages: string[] = [];
    let audio: HTMLAudioElement;

    if (browser) {
        audio = new Audio('https://www.myinstants.com/media/sounds/roblox-death-sound_1.mp3');
    }
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
    {#each messages as message}
        <p>{message}</p>
    {/each}
    <input type="file" accept="audio/*" />
</section>

<style>
    section {
        display: flex;
        flex: 0.6;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
