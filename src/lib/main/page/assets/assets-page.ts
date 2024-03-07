import { writable } from 'svelte/store';

import { invoke, isOnTauri } from '$lib/utils/tauri.js';
import { browser } from '$app/environment';

export const origin = writable<string>();

if (browser) {
    if (isOnTauri) {
        const res = await invoke('share_url');
        origin.set(`http://${res.host}:${res.port}`);
    } else {
        origin.set(window.location.origin);
    }
}
