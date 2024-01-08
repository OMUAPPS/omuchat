import type { WindowOptions } from "@tauri-apps/api/window";
import { get } from "svelte/store";

import type { ChatApp } from "$lib/common/omuchat/chatapp.js";
import { t } from "$lib/i18n/i18n-context.js";
import { isOnTauri, tauriWindow } from "$lib/utils/tauri.js";

export function openApp(app: ChatApp) {
    const windowId = `app-${app.id}`;
    const options: WindowOptions = {
        url: app.url,
        title: get(t)(`apps.${app.id}.name`),
        width: 800,
        height: 600,
        resizable: true,
        maximizable: true,
        transparent: false,
        decorations: true,
        alwaysOnTop: false
    };
    if (isOnTauri) {
        const window = new tauriWindow.WebviewWindow(windowId, options);
        window.setFocus();
    } else {
        window.open(app.url, windowId);
    }
}