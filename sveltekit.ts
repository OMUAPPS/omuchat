declare module '@sveltejs/kit/vite' {
    import { Plugin } from 'vite';
    export function sveltekit(): Plugin;
}