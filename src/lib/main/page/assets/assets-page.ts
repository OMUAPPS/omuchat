import { writable } from "svelte/store";

import { invoke, isOnTauri, waitForLoad } from "$lib/utils/tauri";

export const origin = writable<string>();

waitForLoad().then(async () => {
    if (isOnTauri) {
        const res = await invoke('share_url');
        origin.set(`http://${res.host}:${res.port}`);
    } else {
        origin.set(window.location.origin);
    }
});