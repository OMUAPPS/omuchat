<script lang="ts">
    import type { Message } from '@omuchat/client';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    import { getClient } from '$lib/common/omuchat/client';
    import MessageRenderer from '$lib/main/panel/messages/MessageEntry.svelte';

    export let filter: (message: Message) => boolean = () => true;

    const { chat } = getClient();

    const messages = writable<Message[]>([]);

    chat.messages!.on({
        onCacheUpdate(cache) {
            messages.set([...cache.values()]);
        },
    });
    onMount(async () => {
        messages.set(Object.values(await chat.messages!.fetch(100)));
    });
</script>

<div class="messages">
    {#each Object.values($messages).filter(filter) as message}
        <div class="message">
            <MessageRenderer {message} />
        </div>
    {/each}
</div>

<style lang="scss">
    .messages {
        display: flex;
        flex-direction: column-reverse;
    }

    .message {
        padding: 5px 0;

        &:hover {
            background: var(--color-bg-1);
        }
    }
</style>
