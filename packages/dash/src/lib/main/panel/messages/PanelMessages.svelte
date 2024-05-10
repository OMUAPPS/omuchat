<script lang="ts">
    import type { models } from '@omuchatjs/chat';
    import { onDestroy } from 'svelte';

    import { chat } from '$lib/common/omuchat/client.js';
    import { batchCall } from '$lib/utils/batch.js';
    import type { Identifier } from '@omuchatjs/omu/identifier.js';
    import { MessageEntry, TableList } from '@omuchatjs/ui';

    export let filter: (key: string, message: models.Message) => boolean = () => true;
    export let sort: (a: models.Message, b: models.Message) => number = (a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return a.createdAt.getTime() - b.createdAt.getTime();
    };

    const unlisten = batchCall(
        chat.authors.listen(),
        chat.messages.listen((items) => {
            const authorKeys = [...items.values()]
                .map((message) => message.authorId)
                .filter((key): key is Identifier => !!key);
            chat.authors.getMany(...authorKeys.map((it) => it.key()));
        }),
    );
    onDestroy(unlisten);
</script>

<TableList table={chat.messages} component={MessageEntry} {filter} {sort} reverse={true} />
