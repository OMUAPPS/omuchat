import { writable } from "svelte/store";

import { invoke, waitForLoad } from "$lib/utils/tauri";

export const origin = writable<string>();

waitForLoad().then(async () => {
    const res = await invoke('share_url');
    origin.set(`http://${res.host}:${res.port}`);
});