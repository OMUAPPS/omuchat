import type * as event from '@tauri-apps/api/event';
import type * as api from '@tauri-apps/api/tauri';

let _invoke: typeof api.invoke;
let _listen: typeof event.listen;

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

export async function invoke<T extends keyof Commands>(
    command: T,
    ...args: Commands[T]['args']
): Promise<Commands[T]['return']> {
    assertTauri();
    return _invoke(command, ...args);
}
type TauriEvent<T> = {
    return: event.Event<T>;
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
    [event.TauriEvent.WINDOW_RESIZED]: TauriEvent<unknown>,
    [event.TauriEvent.WINDOW_MOVED]: TauriEvent<unknown>,
    [event.TauriEvent.WINDOW_CLOSE_REQUESTED]: TauriEvent<unknown>,
    [event.TauriEvent.WINDOW_CREATED]: TauriEvent<unknown>,
    [event.TauriEvent.WINDOW_DESTROYED]: TauriEvent<unknown>,
    [event.TauriEvent.WINDOW_FOCUS]: TauriEvent<unknown>,
    [event.TauriEvent.WINDOW_BLUR]: TauriEvent<unknown>,
    [event.TauriEvent.WINDOW_SCALE_FACTOR_CHANGED]: TauriEvent<unknown>,
    [event.TauriEvent.WINDOW_THEME_CHANGED]: TauriEvent<unknown>,
    [event.TauriEvent.WINDOW_FILE_DROP]: TauriEvent<string[]>,
    [event.TauriEvent.WINDOW_FILE_DROP_HOVER]: TauriEvent<unknown>,
    [event.TauriEvent.WINDOW_FILE_DROP_CANCELLED]: TauriEvent<unknown>,
    [event.TauriEvent.MENU]: TauriEvent<unknown>,
    [event.TauriEvent.CHECK_UPDATE]: TauriEvent<unknown>,
    [event.TauriEvent.UPDATE_AVAILABLE]: TauriEvent<unknown>,
    [event.TauriEvent.INSTALL_UPDATE]: TauriEvent<unknown>,
    [event.TauriEvent.STATUS_UPDATE]: TauriEvent<unknown>,
    [event.TauriEvent.DOWNLOAD_PROGRESS]: TauriEvent<unknown>,
}

export function listen<T extends keyof Events>(
    command: T,
    callback: (event: Events[T]['return']) => void,
): Promise<() => void> {
    assertTauri();
    return _listen<Events[T]['return']>(command, (event) => {
        callback(event.payload);
    })
}

let loaded = false;
const loadHandlers: (() => void)[] = [];
const loadPromises: (() => Promise<void>)[] = [];

function loadLazy<T>(load: () => Promise<T>): T {
    let obj: T | any = {};
    loadPromises.push(async () => {
        obj = await load();
    });
    return new Proxy(obj, {
        get(target, prop) {
            if (!loaded) {
                throw new Error('Tauri not loaded yet');
            }
            if (prop in obj) {
                return obj[prop];
            } else {
                throw new Error(`Property ${prop.toString()} not found`);
            }
        }
    });
}

export function assertTauri() {
    if (!checkOnTauri) {
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
    await Promise.all(loadPromises.map(it => it()));
    loadHandlers.forEach(handler => handler());
    loaded = true;
}

export function checkOnTauri() {
    return typeof window.__TAURI_IPC__ !== 'undefined';
}
export const isOnTauri = checkOnTauri();

export function waitForLoad() {
    if (!checkOnTauri) {
        return Promise.resolve();
    }
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
