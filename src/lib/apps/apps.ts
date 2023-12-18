import type { WebviewWindow, WindowOptions } from '@tauri-apps/api/window';

import EmojiApp from './emoji/EmojiApp.svelte';
import PlayQueueApp from './playqueue/PlayQueueApp.svelte';

export interface App {
    component: any;
    id: string;
    icon: string;
    description: string;
    options?: WindowOptions;
}

export const windows: Map<string, WebviewWindow> = new Map();
export const apps = new Map<string, App>();
apps.set('play-queue', {
    component: PlayQueueApp,
    id: 'play-queue',
    description: 'A queue of songs to be played',
    icon: 'ti ti-list',
});
apps.set('emoji', {
    component: EmojiApp,
    id: 'emoji',
    description: 'Emoji',
    icon: 'ti ti-icons',
});