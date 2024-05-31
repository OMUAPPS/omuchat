import { writable } from 'svelte/store';

export const playVideo = writable<(videoId: string) => void>();
