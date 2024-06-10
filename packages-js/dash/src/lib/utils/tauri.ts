import type * as event from '@tauri-apps/api/event';
import type * as api from '@tauri-apps/api/tauri';
import { BROWSER } from 'esm-env';

let _invoke: typeof api.invoke;
let _listen: typeof event.listen;
type ServerStatus = 'NotInstalled' | 'Installing' | 'Installed' | 'AlreadyRunning';
type Commands = {
    share_url: () => {
        host: string;
        port: number;
    };
    run_server: () => void;
    get_token: () => string | null;
    delete_runtime: () => void;
    install_runtime: () => void;
    get_server_state: () => ServerStatus;
    update_libraries: () => void;
};

export async function invoke<T extends keyof Commands>(
    command: T,
    ...args: Parameters<Commands[T]>
): Promise<ReturnType<Commands[T]>> {
    assertTauri();
    return _invoke(command, ...args);
}
type Events = {
    'server-state': ServerStatus;
    'install-progress': {
        progress: number;
        total: number;
        message: string;
    };
    [event.TauriEvent.WINDOW_RESIZED]: unknown;
    [event.TauriEvent.WINDOW_MOVED]: unknown;
    [event.TauriEvent.WINDOW_CLOSE_REQUESTED]: unknown;
    [event.TauriEvent.WINDOW_CREATED]: unknown;
    [event.TauriEvent.WINDOW_DESTROYED]: unknown;
    [event.TauriEvent.WINDOW_FOCUS]: unknown;
    [event.TauriEvent.WINDOW_BLUR]: unknown;
    [event.TauriEvent.WINDOW_SCALE_FACTOR_CHANGED]: unknown;
    [event.TauriEvent.WINDOW_THEME_CHANGED]: unknown;
    [event.TauriEvent.WINDOW_FILE_DROP]: string[];
    [event.TauriEvent.WINDOW_FILE_DROP_HOVER]: unknown;
    [event.TauriEvent.WINDOW_FILE_DROP_CANCELLED]: unknown;
    [event.TauriEvent.MENU]: unknown;
    [event.TauriEvent.CHECK_UPDATE]: unknown;
    [event.TauriEvent.UPDATE_AVAILABLE]: unknown;
    [event.TauriEvent.INSTALL_UPDATE]: unknown;
    [event.TauriEvent.STATUS_UPDATE]: unknown;
    [event.TauriEvent.DOWNLOAD_PROGRESS]: unknown;
};

type TauriEvent<T> = {
    payload: T;
    windowLabel: string;
};

export function listen<T extends keyof Events>(
    command: T,
    callback: (event: TauriEvent<Events[T]>) => void,
): Promise<() => void> {
    assertTauri();
    return _listen(command, (event: TauriEvent<Events[T]>) => {
        event;
        callback(event);
    });
}

export function listenSync<T extends keyof Events>(
    command: T,
    callback: (event: TauriEvent<Events[T]>) => void,
): () => void {
    assertTauri();
    let destroyCallback = () => {};
    let isDestroyed = false;
    _listen(command, (event: TauriEvent<Events[T]>) => {
        callback(event);
    }).then((destroyFunc) => {
        destroyCallback = destroyFunc;
        if (isDestroyed) {
            destroyCallback();
        }
    });
    return () => {
        destroyCallback();
        isDestroyed = true;
    };
}

export async function readFile(file: string): Promise<[string, ArrayBuffer]> {
    assertTauri();
    const name = file.split(/[\\/]/).pop();
    if (!name) throw new Error('Invalid file path');
    const buffer = await tauriFs.readBinaryFile(file);
    return [name, buffer];
}

let loaded = false;
const loadHandlers: (() => void)[] = [];
const loadPromises: (() => Promise<void>)[] = [];

function loadLazy<T extends object>(load: () => Promise<T>): T {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let obj: T = {} as T;
    loadPromises.push(async () => {
        obj = await load();
    });
    const get = (_: T, prop: string | symbol) => {
        if (!loaded) {
            throw new Error('Tauri not loaded yet');
        }
        if (prop in obj) {
            return Object.getOwnPropertyDescriptor(obj, prop)?.value;
        } else {
            throw new Error(`Property ${prop.toString()} not found`);
        }
    };
    return new Proxy(obj, {
        get,
    });
}

export function assertTauri() {
    if (!checkOnTauri()) {
        throw new Error('Not on Tauri');
    }
    if (!loaded) {
        throw new Error('Tauri not loaded yet');
    }
}

export const tauriWindow = loadLazy(() => import('@tauri-apps/api/window'));
export const tauriDialog = loadLazy(() => import('@tauri-apps/api/dialog'));
export const tauriApi = loadLazy(() => import('@tauri-apps/api/tauri'));
export const tauriEvent = loadLazy(() => import('@tauri-apps/api/event'));
export const tauriFs = loadLazy(() => import('@tauri-apps/api/fs'));

async function load() {
    if (!checkOnTauri) {
        return;
    }
    if (loaded) {
        throw new Error('Tauri already loaded');
    }
    const [{ invoke }, { listen }] = await Promise.all([
        import('@tauri-apps/api/tauri'),
        import('@tauri-apps/api/event'),
    ]);
    _invoke = invoke;
    _listen = listen;
    await Promise.all(loadPromises.map((it) => it()));
    loadHandlers.forEach((handler) => handler());
    loaded = true;
}

export function checkOnTauri() {
    if (typeof window === 'undefined') return false;
    if (typeof window.__TAURI_IPC__ === 'undefined') return false;
    return true;
}
export const IS_TAURI = checkOnTauri();

export function waitForTauri() {
    if (!checkOnTauri()) {
        return Promise.resolve();
    }
    if (loaded) {
        return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
        loadHandlers.push(resolve);
    });
}

if (BROWSER) {
    load();
}
