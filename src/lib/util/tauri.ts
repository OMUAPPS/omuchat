import type { WebviewWindow } from '@tauri-apps/api/window';
let appWindow: WebviewWindow | null = null;

export function minimizeWindow() {
    appWindow?.minimize();
}

export function maximizeWindow() {
    appWindow?.maximize();
}

export function closeWindow() {
    appWindow?.close();
}

if (!import.meta.env.SSR) {
    import('@tauri-apps/api/window').then(({ appWindow: _appWindow }) => {
        appWindow = _appWindow;
    });
}