<script lang="ts">
	import type { models } from '@omuchatjs/chat';
	import { onMount } from 'svelte';

	import { getClient } from '$lib/common/omuchat/client.js';
	import TableList from '$lib/common/omuchat/TableList.svelte';
	import MessageEntry from '$lib/main/panel/messages/MessageEntry.svelte';

	const { chat } = getClient();

	export let filter: (key: string, message: models.Message) => boolean = () => true;
	export let sort: (a: models.Message, b: models.Message) => number = (a, b) => {
		if (!a.createdAt || !b.createdAt) return 0;
		return a.createdAt.getTime() - b.createdAt.getTime();
	};

	onMount(() => chat.authors.listen());
</script>

<TableList table={chat.messages} component={MessageEntry} {filter} {sort} reverse={true} />
