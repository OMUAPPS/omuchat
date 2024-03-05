import { writable } from 'svelte/store';

import { SSR, invoke, isOnTauri, waitForLoad } from '$lib/utils/tauri.js';

export const origin = writable<string>();

waitForLoad().then(async () => {
    if (SSR) return;
    if (isOnTauri) {
        const res = await invoke('share_url');
        origin.set(`http://${res.host}:${res.port}`);
    } else {
        origin.set(window.location.origin);
    }
});
