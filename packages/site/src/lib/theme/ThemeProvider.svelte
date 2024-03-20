<script lang="ts">
    import { onMount } from 'svelte';

    import { theme } from './theme.js';

    let styleDiv: HTMLElement;

    onMount(() => {
        theme.subscribe((theme) => {
            styleDiv.innerHTML = '';
            const style = document.createElement('style');
            styleDiv.appendChild(style);
            const css = Object.entries(theme)
                .map(([key, value]) => `${key}: ${value};`)
                .join('\n');
            style.innerHTML = `
                :root {
                    ${css}
                }
            `;
        });
    });
</script>

<div bind:this={styleDiv} class="theme-provider" />
