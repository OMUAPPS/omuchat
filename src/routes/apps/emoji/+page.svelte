<script lang="ts">
	import { models } from '@omuchatjs/chat';
	import { onMount } from 'svelte';

	import { client, type Emoji } from './emoji.js';
	import EmojiEdit from './EmojiEdit.svelte';
	import EmojiEntry from './EmojiEntry.svelte';

	import InputTextLazy from '$lib/common/input/InputTextLazy.svelte';
	import {
		isOnTauri,
		listen,
		readFile,
		tauriApi,
		tauriDialog,
		tauriEvent,
		tauriFs,
		tauriWindow,
		waitForLoad
	} from '$lib/utils/tauri.js';

	let emojis: Map<string, Emoji> = new Map();
	const REGISTRY = client.omu.registry.get<Record<string, Emoji>>({
		name: 'emojis',
		app: 'omu.chat.plugins/emoji'
	});
	REGISTRY.listen((data) => {
		emojis = new Map(Object.entries(data || {}));
	});
	client.run();

	let selectedEmoji: Emoji | undefined;
	let search: string = '';
	let fileDrop: boolean = false;
	let dragFiles: string[] = [];
	let uploading: number = 0;

	async function upload(files: Array<{ key: string; buffer: Uint8Array }>) {
		uploading++;
		files = files.map(({ key, buffer }) => ({ key: `emoji/${key}`, buffer }));
		await client.omu.assets.upload(...files);
		files.forEach(({ key }) => {
			const name = key.split('/')[1].split('.')[0];
			const emoji = {
				id: key,
				name: name,
				regex: `${name}`,
				image_url: client.omu.asset(key)
			};
			emojis.set(emoji.id, emoji);
		});
		REGISTRY.update((data) => ({ ...data, ...Object.fromEntries(emojis) }));
		uploading--;
	}

	onMount(async () => {
		await waitForLoad();
		listen(tauriEvent.TauriEvent.WINDOW_FILE_DROP, async (event) => {
			if (event.windowLabel !== tauriWindow.appWindow.label) return;
			fileDrop = false;
			const files = await Promise.all(event.payload.map((path) => readFile(path)));
			upload(files.map(([key, buffer]) => ({ key, buffer: new Uint8Array(buffer) })));
		});
		listen(tauriEvent.TauriEvent.WINDOW_FILE_DROP_HOVER, (event) => {
			if (event.windowLabel !== tauriWindow.appWindow.label) return;
			fileDrop = true;
			dragFiles = event.payload as string[];
		});
		listen(tauriEvent.TauriEvent.WINDOW_FILE_DROP_CANCELLED, (event) => {
			if (event.windowLabel !== tauriWindow.appWindow.label) return;
			fileDrop = false;
		});
	});

	function deleteEmoji(event: CustomEvent<Emoji>) {
		const emoji = event.detail;
		emojis.delete(emoji.id);
		REGISTRY.update((registry) => {
			if (!registry) return registry;
			delete registry[emoji.id];
			return registry;
		});
		if (selectedEmoji?.id === emoji.id) {
			selectedEmoji = undefined;
		}
	}

	function saveEmoji(event: CustomEvent<Emoji>) {
		const emoji = event.detail;
		emojis.set(emoji.id, emoji);
		REGISTRY.update((registry) => {
			if (!registry) return registry;
			registry[emoji.id] = emoji;
			return registry;
		});
		selectedEmoji = undefined;
	}

	function editEmoji(event: CustomEvent<Emoji>) {
		selectedEmoji = event.detail;
	}

	function testEmoji(event: CustomEvent<Emoji>) {
		const emoji = event.detail;
		const room = new models.Room({
			id: 'test',
			name: 'テスト',
			provider_id: 'test',
			online: false,
			url: window.location.href
		});
		client.chat.rooms.set(room);
		client.chat.messages.add(
			new models.Message({
				id: Date.now().toString(),
				room_id: room.key(),
				content: models.content.RootContent.of([
					models.content.TextContent.of(`${emoji.name} (${emoji.regex})`),
					models.content.ImageContent.of(emoji.image_url, emoji.id, emoji.name)
				]),
				created_at: new Date()
			})
		);
	}

	let files: FileList | undefined;

	async function uploadFiles() {
		if (!files) return;
		const selected = await Promise.all(
			Array.from(files).map(async (file) => {
				const name = file.name;
				const buffer = await file.arrayBuffer();
				return { key: name, buffer: new Uint8Array(buffer) };
			})
		);
		upload(selected);
	}

	async function openFile() {
		const selected = await tauriDialog.open({
			multiple: true,
			filters: [
				{
					name: 'Images',
					extensions: ['png', 'webp', 'jpg', 'jpeg']
				}
			]
		});
		if (!selected) return;
		const files = await Promise.all(
			[...selected].map(async (file) => {
				const name = file.split(/[\\/]/).pop();
				if (!name) throw new Error('Invalid file path');
				const buffer = await tauriFs.readBinaryFile(file);
				return { key: name, buffer };
			})
		);
		upload(files);
	}
</script>

<main>
	<div class="header">
		<div class="title">
			<i class="ti ti-icons" />
			絵文字
		</div>
		<div class="search">
			<InputTextLazy placeholder="検索" bind:value={search} />
		</div>
	</div>
	{#if selectedEmoji}
		<div class="emoji-edit">
			<EmojiEdit emoji={selectedEmoji} on:save={saveEmoji} on:delete={deleteEmoji} />
		</div>
	{/if}
	<div class="emojis">
		<div class="upload">
			<small>
				<i class="ti ti-upload" />
				画像をドラッグ&ドロップして追加できます。
			</small>
			{#if isOnTauri}
				<button class="upload-button" on:click={openFile}>
					<i class="ti ti-upload" />
					もしくはファイルを選択
				</button>
			{:else}
				<input type="file" multiple hidden bind:files on:change={uploadFiles} accept="image/*" />
			{/if}
			{#if uploading > 0}
				<span>
					<i class="ti ti-upload" />
					アップロード中…
				</span>
			{/if}
		</div>
		{#each Array.from(emojis.values()).filter((emoji) => emoji.name.includes(search)) as emoji}
			<EmojiEntry {emoji} on:delete={deleteEmoji} on:edit={editEmoji} on:test={testEmoji} />
		{/each}
	</div>
	<div class="drop" class:active={fileDrop}>
		<div class="tips">
			<i class="ti ti-upload" />
			ドロップして追加
		</div>
		<div class="preview">
			{#each dragFiles as file}
				<img src={tauriApi.convertFileSrc(file)} alt="" />
			{/each}
		</div>
	</div>
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		height: 100%;
		margin: 0;
		background: var(--color-bg-2);
	}

	.header {
		display: flex;
		flex-direction: row;
		gap: 40px;
		align-items: center;
		width: 100%;
		min-height: 80px;
		padding: 20px;
		background: var(--color-bg-2);
		border-bottom: 1px solid var(--color-1);

		.title {
			display: flex;
			flex-direction: row;
			gap: 10px;
			align-items: baseline;
			padding-left: 20px;
			font-size: 18px;
			font-weight: 600;
			color: var(--color-1);
		}
	}

	.emoji-edit {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		padding: 20px;
	}

	.emojis {
		display: flex;
		flex-flow: column;
		gap: 10px;
		width: 100%;
		height: 100%;
		padding: 20px;
		overflow: auto;
		background: var(--color-bg-1);
	}

	.upload {
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: center;
		width: 100%;
		height: 40px;

		.upload-button {
			height: 32px;
			padding: 0 10px;
			color: var(--color-1);
			cursor: pointer;
			background: var(--color-bg-2);
			border: 1px solid var(--color-1);

			&:hover {
				color: var(--color-bg-2);
				background: var(--color-1);
			}
		}

		span {
			display: flex;
			flex-direction: row;
			gap: 10px;
			align-items: center;
			padding: 0 10px;
			font-size: 12px;
			font-weight: bold;
			color: var(--color-1);
		}
	}

	.drop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		opacity: 0;

		.tips {
			position: fixed;
			bottom: 20px;
			left: 20px;
			z-index: 1;
			display: flex;
			flex-direction: row;
			gap: 10px;
			align-items: center;
			padding: 10px;
			font-weight: bold;
			color: var(--color-1);
			pointer-events: none;
			background: var(--color-bg-2);
		}

		.preview {
			position: fixed;
			display: table;
			width: 100%;
			height: 100%;
			pointer-events: none;

			img {
				height: 128px;
				padding: 10px;
				border-radius: 5px;
				object-fit: cover;
			}
		}

		&.active {
			pointer-events: all;
			background: color-mix(in srgb, var(--color-bg-1) 90%, transparent 0%);
			opacity: 1;
			transition: all 0.05s ease-in-out;
		}
	}

	small {
		display: flex;
		flex-direction: row;
		gap: 5px;
		align-items: center;
		width: fit-content;
		padding: 5px;
		font-size: 14px;
		font-weight: bold;
		color: var(--color-1);
		background: var(--color-bg-2);

		i {
			font-size: 1.2em;
		}
	}
</style>
