<script lang="ts">
    import type { models } from '@omuchat/client';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    import { getClient } from '$lib/common/omuchat/client';
    import TableList from '$lib/common/omuchat/TableList.svelte';
    import MessageEntry from '$lib/main/panel/messages/MessageEntry.svelte';

    const { chat } = getClient();

    const messages = writable<models.Message[]>([]);

    onMount(() => {
        return chat.messages.listen((chache) => {
            messages.set([...chache.values()]);
        });
    });
</script>

<div class="messages">
    <TableList table={chat.messages} component={MessageEntry} />
</div>
