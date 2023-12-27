<script lang="ts">
    import { onMount } from 'svelte';

    import { client } from './chat';
    import Comment from './Comment.svelte';

    

    let messages = client.chat.messages.cache;
    onMount(() => {
        client.omu.addListener({
            onReady() {
                client.chat.messages.fetch({
                    before: 100,
                });
            }
        })
        client.chat.messages.setCacheSize(40);
        client.chat.messages.listen((data) => {
            messages = data;
        });
        client.chat.authors.listen();
    });
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