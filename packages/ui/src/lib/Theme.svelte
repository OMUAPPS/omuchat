<script lang="ts">
    import { theme } from './stores.js';

    let css = '';

    $: {
        const properties = Object.entries($theme);
        const lines = properties.map(([key, value]) => `${key}: ${value};`);
        css = `:root {
            ${lines.join('\n')}
        }`;
    }
</script>

<svelte:element this="style">
    {css}
</svelte:element>
