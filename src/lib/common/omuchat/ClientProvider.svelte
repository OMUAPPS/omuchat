<script lang="ts">
	import type { Address } from '@omuchatjs/omu/connection/address.js';

	import { App, Client } from '@omuchatjs/chat';
	import { ServerExtensionType } from '@omuchatjs/omu/extension/server/server-extension.js';

	import { setClient } from './client.js';
	import { DashboardExtensionType } from './dashboard-ext.js';

	import { invoke, isOnTauri } from '$lib/utils/tauri.js';
	import { BrowserTokenProvider } from '@omuchatjs/chat/client.js';

	export let app: App;
	export let connect = true;

	const address = {
		host: window.location.hostname,
		port: 26423,
		secure: false
	};

	class TokenProvider extends BrowserTokenProvider {
		async get(serverAddress: Address, app: App): Promise<string | null> {
			if (isOnTauri) {
				return await invoke('get_token');
			}
			return super.get(serverAddress, app);
		}

		async set(serverAddress: Address, app: App, token: string): Promise<void> {
			return super.set(serverAddress, app, token);
		}
	}

	const client = new Client({
		app,
		address,
		token: new TokenProvider('omu-token')
	});
	const omu = client.omu;
	const dashboard = omu.extensions.register(DashboardExtensionType);
	setClient({
		client: client.omu,
		chat: client.chat,
		server: omu.extensions.get(ServerExtensionType),
		dashboard
	});

	if (connect) {
		client.run();
	}
</script>

<slot />
