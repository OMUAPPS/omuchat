<script lang="ts">
    import type { models } from '@omujs/chat';

    import { ClipboardHelper } from '$lib/utils/clipboard-helper.js';
    import MessageRenderer from './MessageRenderer.svelte';
    import { chat } from './stores.js';

    export let entry: models.Message;
    export let selected: boolean = false;

    let author: models.Author | undefined;

    if (entry.authorId) {
        $chat.authors.get(entry.authorId.key()).then((res) => {
            author = res;
        });
    }

    function handleCopy() {
        ClipboardHelper.writeText(entry.text);
    }
</script>

<MessageRenderer
    paid={entry.paid}
    gifts={entry.gifts}
    createdAt={entry.createdAt}
    content={entry.content}
    {author}
    {handleCopy}
    {selected}
/>
