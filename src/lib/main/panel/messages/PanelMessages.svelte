<script lang="ts">
    import type { models } from '@omuchat/client';
    import { onMount } from 'svelte';

    import { getClient } from '$lib/common/omuchat/client';
    import TableList from '$lib/common/omuchat/TableList.svelte';
    import MessageEntry from '$lib/main/panel/messages/MessageEntry.svelte';
    
    const { chat } = getClient();

    export let filter: (key: string, message: models.Message) => boolean = () => true;
    export let sort: (a: models.Message, b: models.Message) => number = (a, b) => {
        if (!a.created_at || !b.created_at) return 0;
        return a.created_at.getTime() - b.created_at.getTime();
    };

    const destroy = chat.authors.listen();
    onMount(() => {
        return destroy;
    });
</script>

<TableList table={chat.messages} component={MessageEntry} {filter} {sort} reverse={true} />
