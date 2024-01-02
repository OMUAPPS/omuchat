import type * as event from '@tauri-apps/api/event';
import type * as api from '@tauri-apps/api/tauri';
import type { WebviewWindow as _WebviewWindow } from '@tauri-apps/api/window';

let WebviewWindow: typeof _WebviewWindow | undefined;
let appWindow: _WebviewWindow | undefined;
let _invoke: typeof api.invoke;
let _listen: typeof event.listen;

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
    install_runtime: {
        args: [];
        return: void;
    },
    get_server_state: {
        args: [];
        return: 'NotInstalled' | 'Installing' | 'Installed';
    },
    update_libraries: {
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

type Events = {
    'server-state': {
        return: 'NotInstalled' | 'Installing' | 'Installed';
    },
    'install-progress': {
        return: {
            progress: number;
            total: number;
            progress_text: string;
        }
    },
}

export function listen<T extends keyof Events>(
    command: T,
    callback: (event: Events[T]['return']) => void,
): void {
    _listen<Events[T]['return']>(command, (event) => {
        callback(event.payload);
    })
}

export function openWindow(...options: ConstructorParameters<typeof _WebviewWindow>) {
    if (!WebviewWindow) {
        throw new Error('WebviewWindow not initialized');
    }
    return new WebviewWindow(...options);
}

let loaded = false;
const loadHandlers: (() => void)[] = [];

async function load() {
    const [{ WebviewWindow: _WebviewWindow, appWindow: _appWindow }, { invoke }, { listen }] = await Promise.all([
        import('@tauri-apps/api/window'),
        import('@tauri-apps/api/tauri'),
        import('@tauri-apps/api/event'),
    ]);
    WebviewWindow = _WebviewWindow;
    appWindow = _appWindow;
    _invoke = invoke;
    _listen = listen;
    loaded = true;
    loadHandlers.forEach(handler => handler());
}

export function waitForLoad() {
    if (loaded) {
        return Promise.resolve();
    }
    return new Promise<void>(resolve => {
        loadHandlers.push(resolve);
    });
}

if (!import.meta.env.SSR) {
    load();
}