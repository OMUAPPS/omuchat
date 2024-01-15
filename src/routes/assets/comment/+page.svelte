<script lang="ts">
    import { onMount } from 'svelte';

    import { client } from './chat.js';
    import Comment from './Comment.svelte';

    let messages = client.chat.messages.cache;
    client.omu.addListener({
        onReady() {
            client.chat.messages.fetch({
                before: 100
            });
        }
    });

    onMount(() => {
        client.chat.messages.setCacheSize(40);
        client.chat.messages.listen((data) => {
            messages = data;
        });
        client.chat.authors.listen();
    });

    client.run();
</script>

<main>
    {#each messages.entries() as [key, message] (key)}
        <Comment {message} />
    {/each}
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        gap: 10px;
        justify-content: flex-end;
        width: 100%;
        height: 100%;
        padding: 10px;
        overflow: hidden;
    }
</style>
