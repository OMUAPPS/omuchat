<script lang="ts">
	import AppEntry from './AppEntry.svelte';

	import TableList from '$lib/common/omuchat/TableList.svelte';
	import { getClient } from '$lib/common/omuchat/client.js';
	import { tauriWindow } from '$lib/utils/tauri.js';
	import { onMount } from 'svelte';

	const { dashboard } = getClient();

	onMount(() => {
		dashboard.apps.addListener({
			onAdd: () => {
				tauriWindow.appWindow.setFocus();
			}
		});
	});
</script>

<div class="container">
	<TableList table={dashboard.apps} component={AppEntry} fitHeight={true} />
	<a href="https://omuchat.cc/" target="_blank">
		omuchat.ccでアプリを探す
		<i class="ti ti-external-link" />
	</a>
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow-y: auto;
		background: var(--color-bg-1);
	}

	a {
		width: fit-content;
		font-size: 14px;
		font-weight: 600;
		text-decoration: none;

		&:hover {
			border-bottom: 1px solid var(--color-1);
		}
	}
</style>
