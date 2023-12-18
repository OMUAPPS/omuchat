import type { WebviewWindow as _WebviewWindow } from '@tauri-apps/api/window';

let WebviewWindow: typeof _WebviewWindow | undefined;
let appWindow: _WebviewWindow | undefined;
let _invoke: ((cmd: string, args?: any | undefined) => Promise<any>) | undefined;

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

export function openWindow(...options: ConstructorParameters<typeof _WebviewWindow>) {
    if (!WebviewWindow) {
        throw new Error('WebviewWindow not initialized');
    }
    return new WebviewWindow(...options);
}

if (!import.meta.env.SSR) {
    import('@tauri-apps/api/window').then(({ WebviewWindow: _WebviewWindow, appWindow: _appWindow }) => {
        WebviewWindow = _WebviewWindow;
        appWindow = _appWindow;
    });
    import('@tauri-apps/api/tauri').then(({ invoke: i }) => {
        _invoke = i;
    });
}