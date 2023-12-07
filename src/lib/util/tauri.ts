import type { WebviewWindow } from '@tauri-apps/api/window';

let appWindow: WebviewWindow | null = null;
let _invoke: ((cmd: string, args?: any | undefined) => Promise<any>) | null = null;

export function minimizeWindow() {
    appWindow?.minimize();
}

export function maximizeWindow() {
    appWindow?.maximize();
}

export function closeWindow() {
    appWindow?.close();
}

type Commands = {
    share_url: {
        args: [];
        return: {
            host: string;
            port: number;
            url: string;
        }
    },
    run_server: {
        args: [];
        return: void;
    },
    delete_runtime: {
        args: [];
        return: void;
    },
}

export function invoke<T extends keyof Commands>(
    command: T,
    ...args: Commands[T]['args']
): Promise<Commands[T]['return']> {
    return _invoke!(command, ...args);
}

if (!import.meta.env.SSR) {
    import('@tauri-apps/api/window').then(({ appWindow: _appWindow }) => {
        appWindow = _appWindow;
    });
    import('@tauri-apps/api/tauri').then(({ invoke: i }) => {
        _invoke = i;
    });
}