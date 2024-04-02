import { writable } from 'svelte/store';

import { browser } from '$app/environment';
import { invoke, IS_TAURI } from '$lib/utils/tauri.js';

export const origin = writable<string>();

async function setOrigin() {
    if (IS_TAURI) {
        const res = await invoke('share_url');
        origin.set(`http://${res.host}:${res.port}`);
    } else {
        origin.set(window.location.origin);
    }
}

if (browser) {
    setOrigin();
}
