<script lang="ts">
    import type { Message } from '@omuchat/client';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    import { getClient } from '$lib/common/omuchat/client';
    import MessageRenderer from '$lib/main/panel/messages/MessageEntry.svelte';

    export let filter: (message: Message) => boolean = () => true;

    const { chat } = getClient();

    const messages = writable<Message[]>([]);

    onMount(() => {
        return chat.messages.listen((chache) => {
            messages.set([...chache.values()]);
        });
    });
</script>

<div class="messages">
    {#each Object.values($messages).reverse().filter(filter) as message (message.id)}
        <div class="message">
            <MessageRenderer {message} />
        </div>
    {/each}
</div>

<style lang="scss">
    .messages {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: auto;
    }

    .message {
        padding: 5px 0;

        &:hover {
            background: var(--color-bg-1);
        }
    }
</style>
