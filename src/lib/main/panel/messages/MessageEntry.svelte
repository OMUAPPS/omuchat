<script lang="ts">
	import type { models } from '@omuchatjs/chat';

	import Gift from './Gift.svelte';
	import MessageContent from './MessageContent.svelte';
	import Role from './Role.svelte';

	import { getClient } from '$lib/common/omuchat/client.js';
	import Tooltip from '$lib/common/tooltip/Tooltip.svelte';
	import { dateTimeFormats } from '$lib/const.js';
	import { applyOpacity, classes, style } from '$lib/utils/class-helper.js';
	export let entry: models.Message;

	const { chat, client } = getClient();

	let author: models.Author | undefined =
		(entry.author_id && chat.authors.cache.get(entry.author_id)) || undefined;
	async function getAuthor() {
		if (!entry.author_id) return null;
		author = await chat.authors.get(entry.author_id);
	}
	if (!author) getAuthor();
</script>

<div
	class={classes('message', !!(entry.paid || entry.gifts?.length) && 'special')}
	class:special={!!(entry.paid || entry.gifts?.length)}
	style={style(
		entry.paid || entry.gifts?.length
			? {
					background: `${applyOpacity(entry.paid ? 'var(--color-1)' : 'var(--color-2)', 0.1)}`
				}
			: {}
	)}
>
	<div class="left">
		{#if author && author.avatar_url}
			<img
				src={client.proxy(author.avatar_url)}
				alt="avatar"
				class="author-avatar"
				width="32"
				height="32"
			/>
			<Tooltip noBackground>
				<img src={client.proxy(author.avatar_url)} alt="avatar" class="author-avatar-preview" />
			</Tooltip>
		{/if}
	</div>
	<div class="right">
		<div class="author-name">
			<span class="name">
				{#if author}
					{author.name}
					{#if author.roles}
						<div class="roles">
							{#each author.roles as role}
								<Role {role} />
							{/each}
						</div>
					{/if}
					<small>
						{author.id}
					</small>
				{/if}
			</span>
			{#if entry.created_at}
				<span class="time">
					<Tooltip>
						{$dateTimeFormats.full.format(entry.created_at)}
					</Tooltip>
					{$dateTimeFormats.time.format(entry.created_at)}
				</span>
			{/if}
		</div>
		{#if entry.content}
			<div class="message-content">
				<MessageContent component={entry.content} />
			</div>
		{/if}
		{#if entry.paid}
			<div class="paid">
				{entry.paid.currency}{entry.paid.amount}
			</div>
		{/if}
		{#if entry.gifts?.length}
			<div class="gifts">
				{#each entry.gifts as gift}
					<Gift {gift} />
				{/each}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.message {
		display: flex;
		flex-direction: row;
		gap: 10px;
		padding: 10px;
		font-weight: 500;
		border-bottom: 1px solid var(--color-bg-1);

		&:hover {
			background: var(--color-bg-1);
			outline: 1px solid var(--color-1);
			outline-offset: -4px;
		}
	}

	.special {
		border-left: 2px solid var(--color-1);
	}

	.left {
		display: flex;
		flex-direction: column;
		gap: 5px;
		align-items: center;
		min-width: 32px;
		height: fit-content;
		min-height: 32px;
		margin-top: 4px;
		margin-left: 4px;
	}

	.right {
		width: 100%;
	}

	.author-avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
	}

	.author-avatar-preview {
		width: 128px;
		height: 128px;
		outline: 2px solid #000;
	}

	.roles {
		display: flex;
		flex-flow: row nowrap;
		gap: 5px;
		align-items: baseline;
		width: fit-content;
		overflow: hidden;
		white-space: nowrap;
	}

	.author-name {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		padding: 2px 0;
		font-size: 0.8rem;
		color: #666;
		user-select: text;

		.name {
			display: flex;
			flex-direction: row;
			gap: 5px;
			align-items: baseline;
			white-space: nowrap;

			small {
				font-size: 0.6rem;
				color: #999;
			}
		}
	}

	.message-content {
		margin-right: 14px;
		margin-bottom: 5px;
		overflow: clip;
		font-size: 0.9rem;
		text-wrap: wrap;
		word-break: auto-phrase;
		overflow-wrap: break-word;
		white-space: pre-line;
		user-select: text;
	}

	.paid {
		width: 100%;
		padding: 2px;
		font-size: 0.8rem;
		font-weight: bold;
		color: var(--color-1);
		user-select: text;
	}

	.gifts {
		display: flex;
		flex-flow: row nowrap;
		gap: 5px;
		width: 100%;
		margin: 10px 0 0;
	}
</style>
